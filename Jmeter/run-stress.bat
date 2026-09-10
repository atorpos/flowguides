@echo off
REM Stress test - direct origin capacity check against stress_test.jsp.
REM
REM Default rate is 60 req/s (rpm=3600). This drives your ORIGIN, not the
REM Queue-it waiting room, and does not follow redirects (runbook 0.2).
REM
REM Usage: run-stress.bat <threads> <rpm> <duration_sec> <label>
REM Example (60 req/s, 5 min): run-stress.bat 100 3600 300 stress60
REM
REM Smoke first (runbook 5.2), one request:
REM   set LOOPS=1 && run-stress.bat 1 60 30 smoke
REM
REM Convenience: set the rate in req/s instead of req/min:
REM   set RPS=60 && run-stress.bat            (-> rpm=3600)
REM
REM Environment overrides:
REM   HOST            order.smartone.com   (host only - scheme and path are stripped)
REM   TARGETPATH      /jsp/smartpass/tchinese/stress_test.jsp
REM   PORT / PROTOCOL 443 / https
REM   RPS            requests/second; when set, overrides rpm as RPS*60
REM   EXPECTCODE      200           response code must match this (whole-string regex)
REM   MAXLATENCY      0             ms; samples slower than this fail (0 = off)
REM   FOLLOW          false         follow redirects (keep false for a capacity test)
REM   LOOPS           -1 = run until DURATION; 1 = single request per thread
REM   HEAPSIZE        512m
REM   SKIP_PREFLIGHT  1 to skip the curl check

setlocal enabledelayedexpansion

cd /d "%~dp0"

set JMX=stress-test.jmx

if "%HOST%"=="" set HOST=order.smartone.com
if "%PORT%"=="" set PORT=443
if "%PROTOCOL%"=="" set PROTOCOL=https
if "%TARGETPATH%"=="" set TARGETPATH=/jsp/smartpass/tchinese/stress_test.jsp
REM No ^ or $ anchors: the assertion is "Matches", already whole-string.
if "%EXPECTCODE%"=="" set EXPECTCODE=200
if "%MAXLATENCY%"=="" set MAXLATENCY=0
if "%FOLLOW%"=="" set FOLLOW=false
if "%HEAPSIZE%"=="" set HEAPSIZE=512m
if "%LOOPS%"=="" set LOOPS=-1

set THREADS=%1
set RPM=%2
set DURATION=%3
set LABEL=%4
if "%THREADS%"=="" set THREADS=100
if "%RPM%"=="" set RPM=3600
if "%DURATION%"=="" set DURATION=300
if "%LABEL%"=="" set LABEL=stress

REM RPS is a friendlier knob than rpm for a "60 requests per second" ask.
if not "%RPS%"=="" set /a RPM=%RPS%*60

REM A full URL in the host field produces MalformedURLException on every sample.
REM Strip scheme, path and query here.
set RAWHOST=%HOST%
set HOST=%HOST:https://=%
set HOST=%HOST:http://=%
for /f "tokens=1 delims=/" %%H in ("%HOST%") do set HOST=%%H
for /f "tokens=1 delims=?" %%H in ("%HOST%") do set HOST=%%H
if not "%RAWHOST%"=="%HOST%" echo note: HOST "%RAWHOST%" normalised to "%HOST%"
if "%HOST%"=="" (
  echo error: HOST must be a bare hostname, got "%RAWHOST%"
  exit /b 2
)
if not exist "%JMX%" (
  echo error: %JMX% not found in "%CD%"
  exit /b 2
)

REM Ramp over a fifth of the run, but never 0.
set /a RAMPUP=%DURATION%/5
if %RAMPUP% LSS 1 set RAMPUP=1

REM PowerShell for the timestamp - wmic is gone on Windows 11 24H2 / Server 2025.
for /f "usebackq tokens=*" %%I in (`powershell -NoProfile -Command "Get-Date -Format yyyyMMdd-HHmmss"`) do set STAMP=%%I
if "%STAMP%"=="" set STAMP=%RANDOM%
set OUT=results\%LABEL%-%STAMP%
mkdir "%OUT%" 2>nul

set /a RPS_ECHO=%RPM%/60
set URL=%PROTOCOL%://%HOST%:%PORT%%TARGETPATH%
echo target : %URL%
echo load   : threads=%THREADS% rpm=%RPM% (~%RPS_ECHO% req/s) duration=%DURATION%s rampup=%RAMPUP%s loops=%LOOPS% follow=%FOLLOW%
echo expect : code matches %EXPECTCODE%, maxlatency=%MAXLATENCY%ms (0=off)
echo out    : %OUT%

REM Preflight: one browser-shaped request, so a WAF block or surprise redirect
REM shows up immediately instead of after a full run.
if "%SKIP_PREFLIGHT%"=="1" goto :after_preflight
where curl.exe >nul 2>&1 || goto :after_preflight
echo --- preflight ---
curl.exe -sS -o "%OUT%\preflight-body.txt" -D - --max-time 15 -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36" -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" -H "Accept-Language: zh-TW,zh;q=0.9,en;q=0.8" "%URL%"
echo.
echo 200 = origin answers directly, good for a capacity test.
echo 30x = REDIRECT. stress_test.jsp is behind a Queue-it trigger; this plan does
echo   not follow it, so every sample fails the 200 assertion. Point at the
echo   un-triggered origin, or use EXPECTCODE=30[12] to just prove the redirect.
echo 403/429 = the edge is blocking this source IP. The egress IP has to be
echo   allowlisted on the WAF/CDN and Queue-it's Load Test feature enabled
echo   (runbook 0.1 / appendix A). The block page is in %OUT%\preflight-body.txt.
echo 5xx = the origin is already erroring on a single request.
echo -----------------
:after_preflight

REM Heap must stay well under physical RAM. NEVER let the JVM touch swap.
set JVM_ARGS=-Xms%HEAPSIZE% -Xmx%HEAPSIZE% -XX:MaxMetaspaceSize=256m -XX:+UseG1GC -XX:MaxGCPauseMillis=100

call jmeter.bat -n -t "%JMX%" ^
  -l "%OUT%\results.jtl" ^
  -j "%OUT%\jmeter.log" ^
  -e -o "%OUT%\report" ^
  -Jhost=%HOST% ^
  -Jport=%PORT% ^
  -Jprotocol=%PROTOCOL% ^
  -Jpath=%TARGETPATH% ^
  -Jthreads=%THREADS% ^
  -Jrpm=%RPM% ^
  -Jrampup=%RAMPUP% ^
  -Jduration=%DURATION% ^
  -Jloops=%LOOPS% ^
  -Jexpectcode="%EXPECTCODE%" ^
  -Jmaxlatency=%MAXLATENCY% ^
  -Jfollow=%FOLLOW% ^
  -Jjmeter.save.saveservice.output_format=csv ^
  -Jjmeter.save.saveservice.response_data=false ^
  -Jjmeter.save.saveservice.samplerData=false

echo.
echo --- response codes ---
powershell -NoProfile -Command "Import-Csv '%OUT%\results.jtl' | Group-Object responseCode | Sort-Object Count -Descending | ForEach-Object { '  {0,-40} {1,6}' -f $_.Name, $_.Count }"

echo Report: %OUT%\report\index.html
endlocal
