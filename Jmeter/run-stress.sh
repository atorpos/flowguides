#!/usr/bin/env bash
# Stress test - direct origin capacity check against stress_test.jsp.
#
# Default rate is 60 req/s (rpm=3600). This drives your ORIGIN, not the
# Queue-it waiting room, and does not follow redirects (runbook 0.2).
#
# Usage: ./run-stress.sh <threads> <rpm> <duration_sec> <label>
# Example (60 req/s, 5 min): ./run-stress.sh 100 3600 300 stress60
#
# Smoke first (runbook 5.2), one request, from every generator:
#   THREADS=1 LOOPS=1 ./run-stress.sh 1 60 30 smoke
#
# Convenience: set the rate in req/s instead of req/min:
#   RPS=60 ./run-stress.sh            # -> rpm=3600
#
# Environment overrides:
#   HOST            order.smartone.com   (host only - scheme and path are stripped)
#   TARGET_PATH     /jsp/smartpass/tchinese/stress_test.jsp
#   PORT / PROTOCOL 443 / https
#   RPS             requests/second; when set, overrides rpm as RPS*60
#   EXPECT_CODE     200             response code must match this (whole-string regex)
#   MAXLATENCY      0               ms; samples slower than this fail (0 = off)
#   FOLLOW          false           follow redirects (keep false for a capacity test)
#   LOOPS           -1 = run until DURATION; 1 = single request per thread
#   HEAP            512m
#   SKIP_PREFLIGHT  1 to skip the curl check

set -euo pipefail

cd "$(dirname "$0")"

JMX="stress-test.jmx"

HOST="${HOST:-order.smartone.com}"
PORT="${PORT:-443}"
PROTOCOL="${PROTOCOL:-https}"
TARGET_PATH="${TARGET_PATH:-/jsp/smartpass/tchinese/stress_test.jsp}"
EXPECT_CODE="${EXPECT_CODE:-200}"
MAXLATENCY="${MAXLATENCY:-0}"
FOLLOW="${FOLLOW:-false}"

THREADS="${1:-${THREADS:-100}}"
RPM="${2:-${RPM:-3600}}"
DURATION="${3:-${DURATION:-300}}"
LABEL="${4:-${LABEL:-stress}}"
LOOPS="${LOOPS:--1}"

# RPS is a friendlier knob than rpm for a "60 requests per second" ask.
# It wins over the positional rpm only when the caller actually set it.
if [[ -n "${RPS:-}" ]]; then
  RPM=$(( RPS * 60 ))
fi

# A full URL in the host field produces MalformedURLException / "Illegal
# character found in host: '/'" on every sample. Strip scheme, path, query.
RAW_HOST="$HOST"
HOST="${HOST#*://}"
HOST="${HOST%%/*}"
HOST="${HOST%%\?*}"
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
echo "load   : threads=$THREADS rpm=$RPM (~$(( RPM / 60 )) req/s) duration=${DURATION}s rampup=${RAMPUP}s loops=$LOOPS follow=$FOLLOW"
if [[ "$MAXLATENCY" != "0" ]]; then
  echo "expect : code matches ${EXPECT_CODE}, latency < ${MAXLATENCY}ms"
else
  echo "expect : code matches ${EXPECT_CODE} (no latency ceiling)"
fi
echo "out    : $OUT"

# Preflight: one browser-shaped request, so a WAF block or a surprise redirect
# is visible in two seconds instead of after a full run.
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
    200) echo "preflight: 200 - origin answers directly, good for a capacity test." ;;
    30*) echo "preflight: $CODE - REDIRECT. stress_test.jsp is behind a Queue-it trigger."
         echo "           This plan does not follow it (so Queue-it's edge stays unloaded)."
         echo "           Every sample will fail the '200' assertion. Either point at the"
         echo "           un-triggered origin, or run with EXPECT_CODE='30[12]' if you only"
         echo "           want to prove the redirect (that is Test A / queue-load.jmx)." ;;
    403|429)
      echo "preflight: $CODE - the edge is blocking this source IP."
      echo "           No script change fixes this: the generator's egress IP has to be"
      echo "           allowlisted on the WAF/CDN, and Queue-it's Load Test feature has to"
      echo "           be enabled on the account (runbook 0.1 / appendix A)." ;;
    5??) echo "preflight: $CODE - the origin is already erroring on a single request." ;;
    "")  echo "preflight: no HTTP status (curl exit $RC) - DNS, egress or TLS problem." ;;
    *)   echo "preflight: $CODE" ;;
  esac
  if [[ "$CODE" != 2* && "$CODE" != 3* && -s "$PRE_BODY" ]]; then
    echo "body (first 15 lines of ${PRE_BODY}):"
    head -15 "$PRE_BODY" | sed 's/^/  | /'
  fi
  echo "-----------------"
fi

# Heap must stay well under physical RAM. NEVER let the JVM touch swap.
export JVM_ARGS="-Xms${HEAP:-512m} -Xmx${HEAP:-512m} -XX:MaxMetaspaceSize=256m -XX:+UseG1GC -XX:MaxGCPauseMillis=100 -Djava.net.preferIPv4Stack=true"

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
  -Jmaxlatency="$MAXLATENCY" \
  -Jfollow="$FOLLOW" \
  -Jjmeter.save.saveservice.output_format=csv \
  -Jjmeter.save.saveservice.response_data=false \
  -Jjmeter.save.saveservice.samplerData=false \
  | tee "${OUT}/console.log"

# Break the result down by response code. "100% error" on its own says nothing;
# 403 vs 200 vs 302 vs 5xx are four different problems.
echo
echo "--- response codes ---"
awk -F, 'NR>1 {gsub(/"/,"",$4); c[$4]++; n++} END {for (k in c) printf "  %-40s %6d  %5.1f%%\n", k, c[k], 100*c[k]/n; printf "  %-40s %6d\n", "TOTAL", n}' "${OUT}/results.jtl" | sort -k2 -rn

echo "Report: ${OUT}/report/index.html"
