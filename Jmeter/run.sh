#!/usr/bin/env bash
# Usage: ./run.sh <threads> <rpm> <duration_sec> <label>
# Example: ./run.sh 100 12000 300 step3

set -euo pipefail

HOST="${HOST:-your-api.example.com}"
PORT="${PORT:-443}"
PROTOCOL="${PROTOCOL:-https}"
PATH_="/jsp/smartpass/tchinese/customer.jsp"
AUTH="${AUTH:-}"

THREADS="${1:-50}"
RPM="${2:-3000}"
DURATION="${3:-300}"
LABEL="${4:-run}"

STAMP=$(date +%Y%m%d-%H%M%S)
OUT="results/${LABEL}-${STAMP}"
mkdir -p "$OUT"

# Heap must stay well under physical RAM. NEVER let the JVM touch swap.
export JVM_ARGS="-Xms${HEAP:-512m} -Xmx${HEAP:-512m} -XX:MaxMetaspaceSize=256m -XX:+UseG1GC -XX:MaxGCPauseMillis=100 -Djava.net.preferIPv4Stack=true"

jmeter -n -t queue-load.jmx \
  -l "${OUT}/results.jtl" \
  -j "${OUT}/jmeter.log" \
  -e -o "${OUT}/report" \
  -Jhost="$HOST" \
  -Jport="$PORT" \
  -Jprotocol="$PROTOCOL" \
  -Jpath="$PATH_" \
  -JauthHeader="$AUTH" \
  -Jthreads="$THREADS" \
  -Jrpm="$RPM" \
  -Jrampup=$(( DURATION / 5 )) \
  -Jduration="$DURATION" \
  -Jcsvfile="$(pwd)/users.csv" \
  -Jjmeter.save.saveservice.output_format=csv \
  -Jjmeter.save.saveservice.response_data=false \
  -Jjmeter.save.saveservice.samplerData=false

echo "Report: ${OUT}/report/index.html"
