# Queue-it Waiting Room Load Test — Runbook v2

**Platform:** Ubuntu 24.04 LTS on AWS EC2 · Apache JMeter 5.6.3 · Java 17 · AWS CLI v2
**Target:** 200,000 accesses/min (≈ 3,334 req/s)
**Status:** Phases 1–4 validated on a live instance. Phases 5–7 pending.

> **v2 changes:** All commands are Ubuntu (`apt`, not `dnf`). Heap sizing is instance-relative. AWS CLI installs from AWS's official bundle (no `apt` package exists on noble). S3 access uses an IAM instance role — no access keys. Result-sharing options added.

---

# Phase 0 — Decisions before you touch anything

## 0.1 Queue-it must be in the loop

From Queue-it's Load Test White Paper v6.0 (Feb 2026):

- Without the **Load Test feature** on your account, their bot mitigation may interrupt the test and block your source IPs. Contact your CSM or support@queue-it.com.
- Book a load test environment: GO Queue-it → `https://go.queue-it.net/loadtest/list` → **New Load Test**. Provisioning takes ~15 minutes; a readiness URL is provided. Starting the script early makes it fail and stop.
- Queue-it supplies an official JMeter JMX. You set one variable, `LOADTESTLINK` — either from the Load Test details page or built as `https://CUSTOMERID.queue-it.net?c=CUSTOMERID&e=WAITINGROOMID`. **HTTPS waiting rooms only.**
- Their standard test covers up to 750,000 concurrent in queue at 25,000 new users/min. **200k/min is 8× that — state the number when booking.**
- Their guidance: load testing the waiting room is usually unnecessary. Test *your* capacity, then use that number to set MAX_OUTFLOW (agree the value with their solution architects).

## 0.2 Two tests, not one

| | **Test A — Integration under load** | **Test B — Full waiting-room journey** |
|---|---|---|
| Target | Your protected URL | Queue-it waiting room |
| Proves | At 200k/min every un-tokened visitor gets a 302 to `queue-it.net`, and your service stays healthy | Visitors queue, get released at your outflow, return with a valid `queueittoken` |
| Redirect | Not followed — Queue-it's edge is never touched | Followed and polled |
| Queue-it booking | Not required | **Required** |
| Feasible in JMeter at 200k/min | Yes | No — see 0.3 |

**Do Test A at full rate. Do Test B at a rate agreed with Queue-it, inside a booked window.**

## 0.3 Why Test B can't run at 200k/min in JMeter

Every queued user holds a thread alive polling for the whole wait:
`concurrent threads = arrival rate × average wait`

200,000/min × 5 min wait = **1,000,000 threads**. JMeter manages ~2–5k per instance → 200+ boxes. Queue-it's own engineers report ~2,000 max per box on JMeter versus 25,000+ on Gatling, which is why they use Gatling for this.

Your options: keep waits to seconds (high outflow), switch to Gatling, or lower the agreed arrival rate.

## 0.4 Sizing and pass criteria

- 4 × **c6i.2xlarge** (8 vCPU / 16 GB) generators → ~834 req/s each. A 5th as spare.
- Threads per generator: **150** (threads ≥ rps × latency; 834 × 0.1 s ≈ 84, so 150 leaves headroom and lets the timer control pacing, not thread starvation).
- Ramp-up 60 s · steady state **10 min** · Queue-it works in minute buckets, so anything under 3 min is meaningless.

**Write these down before you run:**
- ≥ 99.9 % of responses are `302` with `Location` containing `queue-it.net`
- p95 redirect latency < 200 ms · error rate < 0.1 %
- Target service CPU / memory / 5xx within normal bounds
- Queue-it dashboard inflow matches load; outflow matches MAX_OUTFLOW (Test B)
- No generator IP blocked

## 0.5 Notify

- **Queue-it** — booking, with the 200k/min figure
- **WAF / CDN team** — allowlist every generator Elastic IP, or you'll be testing their rate limiter
- **Service owners / on-call** — the window
- **AWS** — read the current "Penetration Testing / simulated events" policy. 3,334 req/s of small redirects is well under the ~1 Gbps threshold, but screenshot the page.

---

# Phase 1 — Build one generator

Everything here happens on a single instance. You'll bake it into an AMI in Phase 4.

## 1.1 Launch

- **AMI:** Ubuntu 24.04 LTS (x86_64)
- **Type:** c6i.2xlarge for real runs. A t3.micro is fine *only* for the Phase 3 proof-of-concept — burstable instances throttle once CPU credits run out and produce meaningless throughput numbers.
- **Storage:** 50 GB gp3. At 200k/min a 10-min run writes ~1 GB of JTL per box; a full disk kills JMeter silently.
- **Region:** same as your service (removes WAN noise) unless you deliberately want realistic latency.
- **Security group:** inbound SSH 22 from your office IP only; outbound 443 to anywhere.
- **Elastic IP:** attach one. This is the address you give Queue-it and your WAF team.
- **Tags:** `role=jmeter-lg`, `test=queueit`

## 1.2 OS tuning

```bash
# File descriptors — JMeter opens thousands of sockets
tee /etc/security/limits.d/99-jmeter.conf > /dev/null <<'EOF'
*  soft  nofile  1048576
*  hard  nofile  1048576
*  soft  nproc   unlimited
*  hard  nproc   unlimited
EOF

# TCP: more ephemeral ports, faster TIME_WAIT recycling
tee /etc/sysctl.d/99-jmeter.conf > /dev/null <<'EOF'
net.ipv4.ip_local_port_range = 1024 65535
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_fin_timeout = 15
net.core.somaxconn = 65535
net.ipv4.tcp_max_syn_backlog = 65535
net.core.netdev_max_backlog = 65535
EOF
sysctl --system

reboot
```

After reboot: `ulimit -n` → `1048576`.

## 1.3 Swap (optional, small boxes only)

Ubuntu AMIs ship with none. Useful as a safety net during setup and report generation — **not** during a run.

```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile          # mkswap refuses insecure permissions
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
findmnt --verify --verbose   # confirm fstab parses before rebooting

printf 'vm.swappiness=10\nvm.vfs_cache_pressure=50\n' > /etc/sysctl.d/98-swap.conf
sysctl --system
```

Default swappiness of 60 is far too eager for a JVM. **If a generator swaps during a test, discard the results** — GC touches the whole heap, so paged-out memory turns 20 ms pauses into seconds and you end up measuring your own disk. Watch `vmstat 5`; the `si`/`so` columns must stay at 0.

## 1.4 Java 17

```bash
apt update && apt install -y openjdk-17-jre-headless wget tar unzip curl zip
java -version    # openjdk version "17.0.x"
```

## 1.5 JMeter 5.6.3

```bash
cd /opt
wget https://dlcdn.apache.org/jmeter/binaries/apache-jmeter-5.6.3.tgz
wget https://downloads.apache.org/jmeter/binaries/apache-jmeter-5.6.3.tgz.sha512
sha512sum -c apache-jmeter-5.6.3.tgz.sha512     # must print OK

tar -xzf apache-jmeter-5.6.3.tgz
ln -sfn /opt/apache-jmeter-5.6.3 /opt/jmeter
```

## 1.6 JVM heap — size to the instance

**This is the single most common setup failure.** `-Xmx` larger than available RAM makes the JVM die before JMeter starts, with `Native memory allocation (mmap) failed`.

| Instance | RAM | JVM_ARGS |
|---|---|---|
| t3.micro | 1 GB | `-Xms256m -Xmx512m` |
| t3.medium | 4 GB | `-Xms1g -Xmx2g` |
| c6i.2xlarge | 16 GB | `-Xms6g -Xmx6g` |

Rule: ~50 % of RAM, never above 60 %.

```bash
free -h    # check what you actually have first

cat > /etc/profile.d/jmeter.sh <<'EOF'
export JMETER_HOME=/opt/jmeter
export PATH=$PATH:$JMETER_HOME/bin
export JVM_ARGS="-Xms6g -Xmx6g -XX:MaxMetaspaceSize=512m -XX:+UseG1GC"
EOF
source /etc/profile.d/jmeter.sh
jmeter -v
```

To override for one command without editing anything:
```bash
JVM_ARGS="-Xms256m -Xmx512m" jmeter -n -t plan.jmx -l out.jtl
```

## 1.7 Lean result output

```bash
cat >> /opt/jmeter/bin/user.properties <<'EOF'
jmeter.save.saveservice.output_format=csv
jmeter.save.saveservice.response_data=false
jmeter.save.saveservice.samplerData=false
jmeter.save.saveservice.requestHeaders=false
jmeter.save.saveservice.responseHeaders=false
jmeter.save.saveservice.assertion_results_failure_message=true
jmeter.save.saveservice.thread_counts=true
httpclient4.retrycount=0
httpclient.reset_state_on_thread_group_iteration=true
summariser.interval=30
EOF
```

## 1.8 AWS CLI v2

`apt install awscli` **fails on Ubuntu 24.04** — noble has no candidate for that package (it existed in 22.04 and returns in 26.04). Use AWS's bundle:

```bash
cd /tmp
curl -s "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o awscliv2.zip
unzip -q awscliv2.zip
./aws/install
aws --version    # aws-cli/2.x
```

Graviton (t4g/c7g): swap in `awscli-exe-linux-aarch64.zip`.

Skip the snap package on a load generator — snapd adds a daemon competing for CPU during runs.

## 1.9 Plugins (only if you want Throughput Shaping Timer / Concurrency Thread Group)

```bash
cd /opt/jmeter/lib/ext
wget https://repo1.maven.org/maven2/kg/apc/jmeter-plugins-manager/1.10/jmeter-plugins-manager-1.10.jar
cd /opt/jmeter/lib
wget https://repo1.maven.org/maven2/kg/apc/cmdrunner/2.3/cmdrunner-2.3.jar
java -cp /opt/jmeter/lib/ext/jmeter-plugins-manager-1.10.jar org.jmeterplugins.repository.PluginManagerCMDInstaller
/opt/jmeter/bin/PluginsManagerCMD.sh install jpgc-casutg,jpgc-tst
```

---

# Phase 2 — S3 for results

**Do steps 2.1–2.3 from AWS CloudShell or the console**, not from the generator. Those are admin actions; the generator's role deliberately can't perform them.

## 2.1 Bucket

CloudShell (console → terminal icon; credentials are inherited):

```bash
BUCKET=yourcompany-loadtest-results-20260827   # globally unique
REGION=us-east-1                                # match your EC2 region

aws s3api create-bucket --bucket $BUCKET --region $REGION
# non-us-east-1 needs: --create-bucket-configuration LocationConstraint=$REGION

aws s3api put-bucket-encryption --bucket $BUCKET \
  --server-side-encryption-configuration \
  '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'

aws s3api put-bucket-lifecycle-configuration --bucket $BUCKET \
  --lifecycle-configuration '{"Rules":[{"ID":"expire-old-results","Status":"Enabled","Filter":{"Prefix":"queueit/"},"Expiration":{"Days":90}}]}'
```

**Leave Block Public Access ON.** JTL files map your internal hostnames, paths, latency distributions and error patterns.

## 2.2 IAM policy — write-only, one prefix

IAM → Policies → Create policy → JSON. Name it `JMeterLoadTestS3Write`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListBucketPrefix",
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME",
      "Condition": {"StringLike": {"s3:prefix": ["queueit/*"]}}
    },
    {
      "Sid": "WriteResults",
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:AbortMultipartUpload"],
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/queueit/*"
    }
  ]
}
```

**`s3:DeleteObject` is omitted deliberately.** A generator should never be able to destroy results from a run you can't cheaply repeat. The lifecycle rule handles cleanup. Expect `aws s3 rm` to fail with AccessDenied — that's correct behaviour, not a misconfiguration. Listing the bucket *root* will also fail, since ListBucket is scoped to the `queueit/` prefix.

## 2.3 Role and instance profile

IAM → Roles → Create role → **AWS service** → **EC2** → attach `JMeterLoadTestS3Write` and `AmazonSSMManagedInstanceCore` → name it `JMeterLoadGenRole`.

Attach it: EC2 → Instances → select → **Actions → Security → Modify IAM role** → `JMeterLoadGenRole`.

No reboot. IAM propagation takes ~30 s.

## 2.4 Verify from the generator

```bash
aws sts get-caller-identity
# expect: arn:aws:sts::ACCOUNT:assumed-role/JMeterLoadGenRole/i-0abc...
```

If it says `NoCredentials`: wait 30 s, and if you ever ran `aws configure` while troubleshooting, remove the leftovers — **static credentials shadow the role**:

```bash
rm -rf ~/.aws
```

Round trip:

```bash
export BUCKET=your-actual-bucket-name
echo ok > /tmp/t.txt
aws s3 cp /tmp/t.txt s3://$BUCKET/queueit/connectivity-check.txt
aws s3 ls s3://$BUCKET/queueit/
```

Failure meanings: `AccessDenied` on the prefix → policy mismatch · `NoSuchBucket` → typo or wrong account · hang then timeout → outbound 443 blocked, or a private subnet with no NAT / S3 endpoint.

## 2.5 Persist the environment

```bash
cat > /etc/profile.d/loadtest.sh <<'EOF'
export BUCKET=your-actual-bucket-name
export AWS_DEFAULT_REGION=us-east-1
EOF
source /etc/profile.d/loadtest.sh
```

Do this, or you'll keep hitting empty `$BUCKET` in fresh shells.

---

# Phase 3 — Proof of concept

Prove the whole chain — JMeter runs, heap fits, egress works, timer paces, assertions evaluate, JTL writes, report builds, S3 upload succeeds — before pointing anything at your real service.

## 3.1 The plan

`poc-smoke.jmx` (provided separately): 2 threads × 10 loops = 20 requests against `www.apple.com`, paced by a Constant Throughput Timer (`calcMode=2`) to 20/min so the run lasts ~60 s and exits on its own. `follow_redirects=true` and a 200 assertion — the opposite of the real plan, on purpose.

## 3.2 Run it

```bash
mkdir -p /opt/tests/results && cd /opt/tests
jmeter -n -t poc-smoke.jmx -l results/poc.jtl -j results/poc.log
```

**Reference output from a validated run:**
```
summary +      1 in 00:00:01 = 1.2/s Avg: 488 ... Active: 1
summary +     11 in 00:00:32 = 0.3/s Avg:  52 ... Active: 2
summary =     20 in 00:00:57 = 0.4/s Avg:  69 Min: 30 Max: 488 Err: 0 (0.00%)
```

20 samples, ~57 s, 0.4/s ≈ 21/min, zero errors. The 488 ms first sample is DNS + TLS handshake on a cold connection; everything after reuses the keep-alive socket at 30–76 ms. That's why you ignore the ramp-up window when reading real results.

`WARN StatusConsoleListener ... package scanning is deprecated` is Log4j noise from JMeter. Ignore it.

## 3.3 Report and check

```bash
jmeter -g results/poc.jtl -o results/report
awk -F, 'NR>1{t++; if($8=="true")s++} END{print "total="t, "success="s}' results/poc.jtl
```

## 3.4 Upload

```bash
RUN=poc-$(date +%Y%m%d-%H%M%S)
aws s3 cp results/poc.jtl s3://$BUCKET/queueit/$RUN/results.jtl
aws s3 cp results/poc.log s3://$BUCKET/queueit/$RUN/jmeter.log
aws s3 cp results/report s3://$BUCKET/queueit/$RUN/report/ --recursive
aws s3 ls s3://$BUCKET/queueit/$RUN/ --recursive --human-readable
```

> **JMeter appends to an existing `-l` file.** Re-running with the same path silently mixes runs together. Always use a timestamped filename, or `run.sh` below.

---

# Phase 4 — Scripts, then bake the AMI

## 4.1 `/opt/tests/run.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail
HOST="${1:?host}"; TPATH="${2:?path}"; RPM="${3:?rpm per generator}"; DUR="${4:-600}"
: "${BUCKET:?set BUCKET}"
TS=$(date +%Y%m%d-%H%M%S); TAG="$(hostname)-$TS"
OUT=/opt/tests/results/$TAG; mkdir -p "$OUT"
cd /opt/tests

jmeter -n -t queueit-redirect.jmx \
  -Jhost="$HOST" -Jpath="$TPATH" -Jrpm="$RPM" -Jduration="$DUR" \
  -Jthreads=150 -Jrampup=60 \
  -l "$OUT/results.jtl" -j "$OUT/jmeter.log" > "$OUT/console.log" 2>&1

gzip -f "$OUT/results.jtl"          # JTLs compress ~10:1
aws s3 cp "$OUT" "s3://$BUCKET/queueit/$(date +%Y%m%d)/$TAG/" --recursive
echo "uploaded -> s3://$BUCKET/queueit/$(date +%Y%m%d)/$TAG/"
```

Hostname in the S3 path is what stops four generators overwriting each other, and what makes the merge in 6.2 work.

## 4.2 `/opt/tests/upload.sh` (ad-hoc)

```bash
#!/usr/bin/env bash
set -euo pipefail
: "${BUCKET:?set BUCKET}"
SRC="${1:?usage: upload.sh <results-dir>}"
DEST="s3://$BUCKET/queueit/$(date +%Y%m%d)/$(hostname)-$(basename "$SRC")/"
find "$SRC" -name '*.jtl' -exec gzip -f {} \;
aws s3 cp "$SRC" "$DEST" --recursive
echo "uploaded -> $DEST"
```

`chmod +x /opt/tests/*.sh`

## 4.3 Bake

Confirm present: JMeter + `jmeter -v`, Java 17, AWS CLI v2, `unzip`/`zip`, limits + sysctl, `run.sh`, `upload.sh`, both profile.d files, `queueit-redirect.jmx`.

Confirm **absent**: `~/.aws` (would bake credentials into every clone), stale `results/`, `hs_err_pid*.log`.

EC2 → Actions → Image and templates → **Create image** → `jmeter-lg-5.6.3-ubuntu24`.

Launch 3 more from it, **selecting `JMeterLoadGenProfile` in the IAM instance profile field**. Attach an Elastic IP to each. Send all four IPs to Queue-it and your WAF team.

Adjust `JVM_ARGS` to `-Xms6g -Xmx6g` if the AMI was built on a smaller box.

---

# Phase 5 — Execute

## 5.1 Order — don't skip steps

1. **Smoke** — 1 thread, 1 loop, from each generator against the real target
2. **Calibrate** — 1 generator, 5 min, find its ceiling (CPU < 70 %, zero JMeter errors)
3. **25 %** — all four, 50,000/min total, 5 min
4. **100 %** — all four, 200,000/min, 10 min ← *the test of record*
5. **Overshoot (optional)** — 120 %, 5 min

## 5.2 Smoke

```bash
cd /opt/tests
jmeter -n -t queueit-redirect.jmx \
  -Jhost=www.yourservice.com -Jpath=/tickets/event-123 \
  -Jthreads=1 -Jloops=1 -Jduration=30 -Jrpm=60 \
  -l results/smoke.jtl -j results/smoke.log

curl -sI https://www.yourservice.com/tickets/event-123 | grep -iE '^(HTTP|location)'
```

Expect `302` and a `Location` containing `queue-it.net`. A `200` means the page isn't covered by a Queue-it trigger or a cookie is leaking; `403` means your WAF hasn't allowlisted the EIP.

## 5.3 Full run

**Via SSM** (needs `AmazonSSMManagedInstanceCore`, already on the role):

```bash
aws ssm send-command \
  --targets "Key=tag:role,Values=jmeter-lg" \
  --document-name "AWS-RunShellScript" \
  --parameters 'commands=["/opt/tests/run.sh www.yourservice.com /tickets/event-123 50000 600"]'
```

**Via SSH:**

```bash
for h in 10.0.1.11 10.0.1.12 10.0.1.13 10.0.1.14; do
  ssh -i key.pem ubuntu@$h "/opt/tests/run.sh www.yourservice.com /tickets/event-123 50000 600" &
done; wait
```

4 × 50,000 rpm = **200,000/min**. Use `12500` for the 25 % step.

## 5.4 Watch

- **Generator:** `tail -f /opt/tests/results/*/console.log` — each box should read ≈ 833/s
- **CPU:** `top` — JMeter java under ~70 %. **Numbers from a saturated generator are worthless.**
- **Swap:** `vmstat 5` — `si`/`so` must stay 0
- **Target:** CloudWatch / APM
- **Queue-it:** GO dashboard — inflow, queue size, outflow (Test B)

Abort: `pkill -f ApacheJMeter`, or gracefully `/opt/jmeter/bin/shutdown.sh`.

## 5.5 Test B

1. Get Queue-it's JMX from support.
2. Set `LOADTESTLINK` from the Load Test details page.
3. **Verify with Threads = 1, Loop = 1 first** — Queue-it's own instruction; it keeps your IP from being challenged by their scripting protection.
4. Wait for the readiness URL before starting.
5. Rate and duration per 0.3 and what you agreed with Queue-it.

---

# Phase 6 — Analyze

## 6.1 Collect

`run.sh` uploads automatically. Otherwise: `/opt/tests/upload.sh /opt/tests/results/<tag>`

## 6.2 Merge and report

```bash
mkdir merged && cd merged
aws s3 cp s3://$BUCKET/queueit/20260901/ . --recursive
gunzip */results.jtl.gz

head -n1 $(ls */results.jtl | head -n1) > all.jtl   # header from first file only
tail -q -n +2 */results.jtl >> all.jtl

jmeter -g all.jtl -o report/
```

Confirm "Hits per second" plateaus at ~3,334/s. Check p95, error %, and the assertion-failure breakdown.

```bash
awk -F, 'NR>1{t++; if($8=="true")s++; if($4=="302")r++} END{print "total="t,"success="s,"302s="r}' all.jtl
```

## 6.3 Share the report

The dashboard is a **directory** — `index.html` plus `content/` and asset folders. Presigning `index.html` alone gives an unstyled blank page, because the assets get requested unsigned.

**Zip + presigned URL** (easiest, stays private):
```bash
zip -qr report-$(date +%Y%m%d).zip report/
aws s3 cp report-*.zip s3://$BUCKET/queueit/reports/
aws s3 presign s3://$BUCKET/queueit/reports/report-20260827.zip --expires-in 604800
```
Max is 7 days. **Generate it from CloudShell with your own credentials** — a URL signed with instance-role credentials expires when those rotate, often within hours, regardless of `--expires-in`.

**Colleagues pull it themselves** (best standing arrangement): give their IAM identity `s3:ListBucket` on the bucket with prefix `queueit/*` and `s3:GetObject` on `queueit/*`. They use the console or `aws s3 cp ... --recursive`.

**Static website hosting** renders it live but requires disabling Block Public Access and serves HTTP only. Given the content, use a separate bucket if you go this route — don't mix public artifacts with raw JTL data.

## 6.4 Record

Run ID, window, generator count/type, achieved rps, p50/p95/p99, error %, assertion failures, target CPU/5xx, Queue-it inflow/outflow screenshots, S3 path to the merged JTL. Score against 0.4.

---

# Phase 7 — Clean up

- Stop (don't terminate) generators until the report is signed off, then terminate and **release the Elastic IPs**
- WAF/CDN team removes the allowlist entries
- Queue-it environment expires with the booking — nothing to do
- Lifecycle rule expires S3 results at 90 days

---

# Appendix A — Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `dnf: no enabled repositories` | `dnf` is for Amazon Linux/RHEL | Use `apt` (1.4) |
| `Package 'awscli' has no installation candidate` | No such package on Ubuntu noble | Official installer (1.8) |
| `mmap failed ... insufficient memory` at JMeter start | `-Xmx` exceeds RAM | Size heap to instance (1.6) |
| `NoCredentials` | Role not attached, or stale `~/.aws` shadowing it | Attach profile (2.3); `rm -rf ~/.aws` |
| `AccessDenied` on `s3 rm` | Intentional — no DeleteObject | Delete from console; leave the policy alone |
| `AccessDenied` listing bucket root | ListBucket scoped to `queueit/*` | List the prefix, not the root |
| `Too many open files` | ulimit not applied | 1.2, then log out/in or reboot |
| `Cannot assign requested address` | Ephemeral port exhaustion | sysctl (1.2); keep keep-alive on |
| Throughput below target, threads all busy | Too few threads for the latency | Raise `-Jthreads` |
| Throughput below target, CPU 100 % | Generator saturated | Bigger/more instances; **discard those results** |
| Response times spiking, `vmstat` si/so > 0 | Swapping during a run | Lower `-Xmx` or bigger instance; discard results |
| All 403 / 429 | WAF/CDN/Queue-it bot protection | Allowlist EIPs; for Test B be inside the booked window |
| `200` instead of `302` | Page not covered by a trigger, or cookie leaking | Check Integration Config; cookie manager clears each iteration |
| Test B script fails and stops immediately | Environment not ready | Wait for readiness URL, restart |
| Results look doubled | JMeter appended to an existing JTL | Timestamped filenames |

# Appendix B — Pre-flight checklist

**Queue-it**
- [ ] Load Test feature confirmed on the account
- [ ] Window booked, with 200k/min stated
- [ ] Official JMX obtained, `LOADTESTLINK` set, 1-thread/1-loop verification passed
- [ ] MAX_OUTFLOW discussed with their solution architects

**AWS**
- [ ] 4 generators from the baked AMI, `JMeterLoadGenProfile` attached
- [ ] Elastic IPs attached and recorded
- [ ] `jmeter -v`, `ulimit -n`, `aws sts get-caller-identity` verified on **each** box
- [ ] `JVM_ARGS` matches the instance size
- [ ] Bucket, lifecycle rule, encryption in place; Block Public Access ON

**Coordination**
- [ ] WAF/CDN allowlist confirmed active
- [ ] Service owners and on-call notified
- [ ] AWS load-testing policy reviewed

**Test**
- [ ] Pass criteria (0.4) agreed in writing
- [ ] Smoke test passed from every generator against the real target
- [ ] `pkill -f ApacheJMeter` ready on every box
