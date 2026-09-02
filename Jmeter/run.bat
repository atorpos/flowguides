@echo off
REM Test A - Queue-it redirect load test.
REM
REM Usage: run.bat <threads> <rpm> <duration_sec> <label>
REM Example: run.bat 100 12000 300 step3
REM
REM Smoke first (runbook 5.2), one request:
REM   set LOOPS=1 && run.bat 1 60 30 smoke
REM
REM Environment overrides:
REM   HOST            order.smartone.com   (host only - scheme and path are stripped)
REM   TARGETPATH      /jsp/smartpass/tchinese/customer.jsp
REM   PORT / PROTOCOL 443 / https
REM   EXPECTCODE      30[12]        response code must match this (whole-string regex)
REM   EXPECTLOCATION  queue-it.net  response headers must contain this
REM                                 (use .* to disable the check)
REM   LOOPS           -1 = run until DURATION; 1 = single request per thread
REM   HEAPSIZE        512m
REM   SKIP_PREFLIGHT  1 to skip the curl check
REM   AUTH            optional Authorization header value (normally unset)

setlocal

cd /d "%~dp0"

set JMX=queue-load.jmx

if "%HOST%"=="" set HOST=order.smartone.com
if "%PORT%"=="" set PORT=443
if "%PROTOCOL%"=="" set PROTOCOL=https
REM The old default here was /api/jobs, which is why a run against
REM order.smartone.com produced 60 x 403 from https://order.smartone.com/api/jobs.
if "%TARGETPATH%"=="" set TARGETPATH=/jsp/smartpass/tchinese/customer.jsp
REM No ^ or $ anchors: the assertion is "Matches", which is already whole-string,
REM and a caret in a batch variable gets eaten by cmd's own escaping.
if "%EXPECTCODE%"=="" set EXPECTCODE=30[12]
if "%EXPECTLOCATION%"=="" set EXPECTLOCATION=queue-it.net
if "%HEAPSIZE%"=="" set HEAPSIZE=512m
if "%LOOPS%"=="" set LOOPS=-1

set THREADS=%1
set RPM=%2
set DURATION=%3
set LABEL=%4
if "%THREADS%"=="" set THREADS=50
if "%RPM%"=="" set RPM=3000
if "%DURATION%"=="" set DURATION=300
if "%LABEL%"=="" set LABEL=run

REM A full URL in the host field is what produced
REM   Non HTTP response code: java.net.MalformedURLException
REM   Illegal character found in host: '/'
REM on every sample of the earlier runs. Strip scheme, path and query here.
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

REM Ramp over a fifth of the run, but never 0 - a 0 s ramp starts every thread in
REM the same millisecond and the first seconds of the result are meaningless.
set /a RAMPUP=%DURATION%/5
if %RAMPUP% LSS 1 set RAMPUP=1

REM wmic is deprecated and absent on Windows 11 24H2 / Server 2025, where the old
REM `wmic os get localdatetime` left STAMP empty, so every run wrote into the same
REM directory and JMeter appended to the previous JTL. PowerShell is always present.
for /f "usebackq tokens=*" %%I in (`powershell -NoProfile -Command "Get-Date -Format yyyyMMdd-HHmmss"`) do set STAMP=%%I
if "%STAMP%"=="" set STAMP=%RANDOM%
set OUT=results\%LABEL%-%STAMP%
mkdir "%OUT%" 2>nul

set URL=%PROTOCOL%://%HOST%:%PORT%%TARGETPATH%
echo target : %URL%
echo load   : threads=%THREADS% rpm=%RPM% duration=%DURATION%s rampup=%RAMPUP%s loops=%LOOPS%
echo expect : code matches %EXPECTCODE%, response headers contain "%EXPECTLOCATION%"
echo out    : %OUT%

REM Preflight: one browser-shaped request, so a WAF block shows up immediately
REM instead of after a full run of identical 403s. curl.exe ships with Win10 1803+.
if "%SKIP_PREFLIGHT%"=="1" goto :after_preflight
where curl.exe >nul 2>&1 || goto :after_preflight
echo --- preflight ---
curl.exe -sS -o "%OUT%\preflight-body.txt" -D - --max-time 15 -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36" -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" -H "Accept-Language: zh-TW,zh;q=0.9,en;q=0.8" "%URL%"
echo.
echo 30x = redirect present, good.
echo 403/429 = the edge is blocking this source IP. No script change fixes that:
echo   the egress IP has to be allowlisted on the WAF/CDN, and Queue-it's Load Test
echo   feature has to be enabled on the account (runbook 0.1 / appendix A).
echo   The block page is in %OUT%\preflight-body.txt.
echo 200 = the page is not covered by a Queue-it trigger, or a cookie leaked.
echo -----------------
:after_preflight

REM Heap must stay well under physical RAM. NEVER let the JVM touch swap.
set JVM_ARGS=-Xms%HEAPSIZE% -Xmx%HEAPSIZE% -XX:MaxMetaspaceSize=256m -XX:+UseG1GC -XX:MaxGCPauseMillis=100

REM An empty -JauthHeader makes JMeter drop the property and the plan then sends a
REM bare `Authorization:` header, which is itself a WAF trigger. Only pass it when set.
set AUTHARG=
if not "%AUTH%"=="" set AUTHARG=-JauthHeader=%AUTH%

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
  -Jexpectlocation="%EXPECTLOCATION%" ^
  %AUTHARG% ^
  -Jjmeter.save.saveservice.output_format=csv ^
  -Jjmeter.save.saveservice.response_data=false ^
  -Jjmeter.save.saveservice.samplerData=false

REM Break the result down by response code. "100%% error" on its own says nothing;
REM 403 vs 200 vs 302-to-the-wrong-host are three different problems.
echo.
echo --- response codes ---
powershell -NoProfile -Command "Import-Csv '%OUT%\results.jtl' | Group-Object responseCode | Sort-Object Count -Descending | ForEach-Object { '  {0,-40} {1,6}' -f $_.Name, $_.Count }"

echo Report: %OUT%\report\index.html
endlocal
