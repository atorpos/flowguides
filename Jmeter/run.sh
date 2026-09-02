#!/usr/bin/env bash
# Test A - Queue-it redirect load test.
#
# Usage: ./run.sh <threads> <rpm> <duration_sec> <label>
# Example: ./run.sh 100 12000 300 step3
#
# Smoke first (runbook 5.2), one request, from every generator:
#   THREADS=1 LOOPS=1 ./run.sh 1 60 30 smoke
#
# Environment overrides:
#   HOST            order.smartone.com   (host only - scheme and path are stripped)
#   TARGET_PATH     /jsp/smartpass/tchinese/customer.jsp
#   PORT / PROTOCOL 443 / https
#   EXPECT_CODE     30[12]          response code must match this (whole-string regex;
#                                   the assertion is "Matches", so no ^ or $ needed)
#   EXPECT_LOCATION queue-it.net    substring the response headers must contain
#                                   (set to empty to skip that check)
#   LOOPS           -1 = run until DURATION; 1 = single request per thread
#   HEAP            512m
#   SKIP_PREFLIGHT  1 to skip the curl check
#   AUTH            optional Authorization header value (normally unset)

set -euo pipefail

cd "$(dirname "$0")"

JMX="queue-load.jmx"

HOST="${HOST:-order.smartone.com}"
PORT="${PORT:-443}"
PROTOCOL="${PROTOCOL:-https}"
TARGET_PATH="${TARGET_PATH:-/jsp/smartpass/tchinese/customer.jsp}"
EXPECT_CODE="${EXPECT_CODE:-30[12]}"
EXPECT_LOCATION="${EXPECT_LOCATION-queue-it.net}"
# JMeter drops a -J property with an empty value, so the plan would fall back to
# its own default rather than skipping the check. `.*` is the "match anything" form.
[[ -n "$EXPECT_LOCATION" ]] || EXPECT_LOCATION=".*"
AUTH="${AUTH:-}"

THREADS="${1:-${THREADS:-50}}"
RPM="${2:-${RPM:-3000}}"
DURATION="${3:-${DURATION:-300}}"
LABEL="${4:-${LABEL:-run}}"
LOOPS="${LOOPS:--1}"

# A full URL in the host field is what produced
#   Non HTTP response code: java.net.MalformedURLException
#   Illegal character found in host: '/'
# on every sample of the earlier runs. Strip scheme, path, and any trailing dot
# rather than passing it through and failing 60 times.
RAW_HOST="$HOST"
HOST="${HOST#*://}"     # drop scheme
HOST="${HOST%%/*}"      # drop path
HOST="${HOST%%\?*}"     # drop query
if [[ "$HOST" == *:* ]]; then
  PORT="${HOST##*:}"
  HOST="${HOST%%:*}"
fi
if [[ "$RAW_HOST" != "$HOST" ]]; then
  echo "note: HOST '$RAW_HOST' normalised to '$HOST' (port $PORT)" >&2
fi
if [[ -z "$HOST" || "$HOST" == */* ]]; then
  echo "error: HOST must be a bare hostname, got '$RAW_HOST'" >&2
  exit 2
fi

# Path must be absolute; JMeter silently builds a bad URL otherwise.
[[ "$TARGET_PATH" == /* ]] || TARGET_PATH="/$TARGET_PATH"

command -v jmeter >/dev/null 2>&1 || { echo "error: jmeter not on PATH" >&2; exit 2; }
[[ -f "$JMX" ]] || { echo "error: $JMX not found in $(pwd)" >&2; exit 2; }

# Ramp over a fifth of the run, but never 0 - a 0 s ramp starts every thread in
# the same millisecond and the first seconds of the result are meaningless.
RAMPUP=$(( DURATION / 5 ))
(( RAMPUP > 0 )) || RAMPUP=1

STAMP=$(date +%Y%m%d-%H%M%S)
OUT="results/${LABEL}-${STAMP}"
mkdir -p "$OUT"

URL="${PROTOCOL}://${HOST}:${PORT}${TARGET_PATH}"
echo "target : $URL"
echo "load   : threads=$THREADS rpm=$RPM duration=${DURATION}s rampup=${RAMPUP}s loops=$LOOPS"
if [[ "$EXPECT_LOCATION" == ".*" ]]; then
  echo "expect : code matches ${EXPECT_CODE} (Location check disabled)"
else
  echo "expect : code matches ${EXPECT_CODE}, response headers contain '${EXPECT_LOCATION}'"
fi
echo "out    : $OUT"

# Preflight: one browser-shaped request, so a WAF block is visible in two seconds
# instead of after a full run of identical 403s.
if [[ "${SKIP_PREFLIGHT:-0}" != "1" ]] && command -v curl >/dev/null 2>&1; then
  echo "--- preflight ---"
  set +e
  PRE_BODY="${OUT}/preflight-body.txt"
  PRE=$(curl -sS -o "$PRE_BODY" -D - --max-time 15 \
    -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36' \
    -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' \
    -H 'Accept-Language: zh-TW,zh;q=0.9,en;q=0.8' \
    "$URL" 2>&1)
  RC=$?
  set -e
  echo "$PRE" | grep -iE '^(HTTP/|location:|server:|cf-|x-cache)' || echo "$PRE" | head -3
  CODE=$(printf '%s' "$PRE" | grep -oE '^HTTP/[0-9.]+ [0-9]{3}' | tail -1 | awk '{print $2}')
  case "$CODE" in
    30*) echo "preflight: $CODE - redirect present, good" ;;
    403|429|5??)
      echo "preflight: $CODE - the edge is blocking this source IP."
      echo "           No script change fixes this: the generator's egress IP has to be"
      echo "           allowlisted on the WAF/CDN, and Queue-it's Load Test feature has to"
      echo "           be enabled on the account (runbook 0.1 / appendix A)." ;;
    200) echo "preflight: 200 - no redirect. The page is not covered by a Queue-it trigger, or a cookie leaked." ;;
    "")  echo "preflight: no HTTP status (curl exit $RC) - DNS, egress or TLS problem." ;;
    *)   echo "preflight: $CODE" ;;
  esac
  # The block page names the WAF product and often the rule that fired.
  if [[ "$CODE" != 2* && "$CODE" != 3* && -s "$PRE_BODY" ]]; then
    echo "body (first 15 lines of ${PRE_BODY}):"
    head -15 "$PRE_BODY" | sed 's/^/  | /'
  fi
  echo "-----------------"
fi

# Heap must stay well under physical RAM. NEVER let the JVM touch swap.
export JVM_ARGS="-Xms${HEAP:-512m} -Xmx${HEAP:-512m} -XX:MaxMetaspaceSize=256m -XX:+UseG1GC -XX:MaxGCPauseMillis=100 -Djava.net.preferIPv4Stack=true"

# An empty -JauthHeader makes JMeter drop the property and the plan then sends a
# bare `Authorization:` header, which is itself a WAF trigger. Only pass it when set.
AUTH_ARG=()
[[ -n "$AUTH" ]] && AUTH_ARG=(-JauthHeader="$AUTH")

jmeter -n -t "$JMX" \
  -l "${OUT}/results.jtl" \
  -j "${OUT}/jmeter.log" \
  -e -o "${OUT}/report" \
  -Jhost="$HOST" \
  -Jport="$PORT" \
  -Jprotocol="$PROTOCOL" \
  -Jpath="$TARGET_PATH" \
  -Jthreads="$THREADS" \
  -Jrpm="$RPM" \
  -Jrampup="$RAMPUP" \
  -Jduration="$DURATION" \
  -Jloops="$LOOPS" \
  -Jexpectcode="$EXPECT_CODE" \
  -Jexpectlocation="$EXPECT_LOCATION" \
  "${AUTH_ARG[@]}" \
  -Jjmeter.save.saveservice.output_format=csv \
  -Jjmeter.save.saveservice.response_data=false \
  -Jjmeter.save.saveservice.samplerData=false \
  | tee "${OUT}/console.log"

# Break the result down by response code. "100% error" on its own says nothing;
# 403 vs 200 vs 302-to-the-wrong-host are three different problems.
echo
echo "--- response codes ---"
awk -F, 'NR>1 {gsub(/"/,"",$4); c[$4]++; n++} END {for (k in c) printf "  %-40s %6d  %5.1f%%\n", k, c[k], 100*c[k]/n; printf "  %-40s %6d\n", "TOTAL", n}' "${OUT}/results.jtl" | sort -k2 -rn

echo "Report: ${OUT}/report/index.html"
