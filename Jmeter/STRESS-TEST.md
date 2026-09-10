# stress_test.jsp Stress Test — 60 req/s

A dedicated JMeter plan that drives a fixed rate (default **60 req/s = 3,600
req/min**) at
`https://order.smartone.com/jsp/smartpass/tchinese/stress_test.jsp` and reports
latency, error rate and the response-code breakdown.

This is an **origin capacity** test — "test *your* capacity" (runbook §0.2). It
is **not** the Queue-it waiting-room journey (Test B), and it is not the queue
redirect check (Test A / `queue-load.jmx`).

## Files

| File | Purpose |
|---|---|
| `stress-test.jmx` | The test plan. Every knob is a `-J` property. |
| `run-stress.sh` | Linux/macOS runner (preflight → run → report → code breakdown). |
| `run-stress.bat` | Windows runner, same behaviour. |

## Run it

Prereq: JMeter 5.6.3 on `PATH` (runbook §1.5), Java 17 (§1.4).

```bash
cd Jmeter

# 1) Smoke first — one request, confirms the target answers (runbook §5.2)
THREADS=1 LOOPS=1 ./run-stress.sh 1 60 30 smoke

# 2) The ask: 60 req/s for 5 minutes
./run-stress.sh 100 3600 300 stress60
#   args are:      threads  rpm  duration(s)  label
#   rpm 3600 = 60 req/s. Or use the friendlier knob: RPS=60 ./run-stress.sh
```

Windows: `run-stress.bat 100 3600 300 stress60` (or `set RPS=60 && run-stress.bat`).

Each run writes a timestamped `results/<label>-<stamp>/` folder containing
`results.jtl`, `jmeter.log`, `console.log`, the curl `preflight-body.txt`, and a
full HTML dashboard at `report/index.html`.

### Knobs (`-J` properties / env vars)

| Knob | Default | Meaning |
|---|---|---|
| `RPS` / `rpm` | 60 / 3600 | Target rate. `RPS` wins and sets `rpm = RPS×60`. |
| `threads` | 100 | Concurrent virtual users. Must be ≥ rps × latency; 100 is ample for 60/s. |
| `duration` | 300 | Seconds. Keep ≥ 180 — Queue-it works in minute buckets (§0.4). |
| `expectcode` | `200` | Whole-string regex the response code must match. |
| `maxlatency` | `0` | ms; samples slower than this **fail**. `0` = off. Set `200` for the §0.4 p95 target. |
| `follow` | `false` | Follow redirects. **Leave false** — see below. |
| `HOST` `PORT` `PROTOCOL` `TARGET_PATH` | prod values | Override the target. |

## Why redirects are not followed

If `stress_test.jsp` is covered by a Queue-it trigger it answers **302 →
`queue-it.net`**. Following that at 3,600 req/min would put load on Queue-it's
edge, which §0.2 says never to do from a capacity test. So the plan does **not**
follow the redirect: a 302 instead surfaces as an assertion failure that tells
you the endpoint is queue-protected, without loading Queue-it. If a redirect is
expected and you only want to prove it, that is Test A (`queue-load.jmx`), or run
this with `EXPECT_CODE='30[12]'`.

## Check for issues — how to read the result

The runner prints a response-code breakdown and the HTML report has the detail.
Score against these (runbook §0.4):

- **Error rate < 0.1 %**, and the assertion-failure count is 0.
- **p95 latency** within your SLA (§0.4 uses < 200 ms for the redirect; set your
  own with `maxlatency`).
- Achieved rate holds at ~**60/s** for the whole steady state. If it sags while
  every thread is busy, raise `-Jthreads`; if it sags at 100 % generator CPU, the
  box is saturated — **discard the results** and use a bigger one (§Appendix A).
- Target service **CPU / memory / 5xx** stay within normal bounds during the run.

What each code means when it dominates the breakdown:

| Code | Meaning |
|---|---|
| `200` | Origin answering directly — the healthy case. |
| `302` | `stress_test.jsp` is behind a Queue-it trigger (see above). |
| `403` / `429` | The WAF/CDN is blocking the generator IP. No script change fixes this. |
| `5xx` | Origin overloaded or erroring under the load — the finding you're testing for. |
| timeouts / `Non HTTP response` | Connection exhaustion or origin not responding; check §Appendix A (ulimits, ephemeral ports). |

## Before you run against production — authorization

This drives real traffic at a production host. Per runbook §0.1 / §0.5, before a
real run confirm:

- **Queue-it Load Test feature** is enabled on the account, or bot mitigation
  will block the source IPs mid-test.
- **WAF / CDN team** has allowlisted the generator's egress IP(s) — otherwise
  you are only testing their rate limiter (you'll see all `403`/`429`).
- **Service owners / on-call** know the window.
- **AWS** simulated-events policy is reviewed (§0.5). 60 req/s is tiny, but note it.

The `run-stress.sh` preflight fires a single browser-shaped request first, so a
block or a surprise redirect shows up in seconds instead of after a full run.

## Validation

The plan was validated with JMeter 5.6.3 against a local server: it loads
cleanly, the Constant Throughput Timer paced 943 samples over 15 s (**~62/s**,
target 60), all passed with `expectcode=200`, and a deliberate `expectcode`
mismatch failed 100 % of samples with the custom message — confirming issue
detection works. It was **not** run against the production endpoint (that is
yours to run inside an authorized window, per §0.1/§0.5).
