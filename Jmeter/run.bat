@echo off
REM Usage: run.bat <threads> <rpm> <duration_sec> <label>
REM Example: run.bat 100 12000 300 step3

setlocal

if "%HOST%"=="" set HOST=your-api.example.com
if "%PORT%"=="" set PORT=443
if "%PROTOCOL%"=="" set PROTOCOL=https
if "%APIPATH%"=="" set APIPATH=/api/jobs
if "%HEAPSIZE%"=="" set HEAPSIZE=512m

set THREADS=%1
set RPM=%2
set DURATION=%3
set LABEL=%4
if "%THREADS%"=="" set THREADS=50
if "%RPM%"=="" set RPM=3000
if "%DURATION%"=="" set DURATION=300
if "%LABEL%"=="" set LABEL=run

for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set DT=%%I
set STAMP=%DT:~0,8%-%DT:~8,6%
set OUT=results\%LABEL%-%STAMP%
mkdir "%OUT%" 2>nul

set JVM_ARGS=-Xms%HEAPSIZE% -Xmx%HEAPSIZE% -XX:MaxMetaspaceSize=256m -XX:+UseG1GC -XX:MaxGCPauseMillis=100

call jmeter.bat -n -t queue-load.jmx ^
  -l "%OUT%\results.jtl" ^
  -j "%OUT%\jmeter.log" ^
  -e -o "%OUT%\report" ^
  -Jhost=%HOST% ^
  -Jport=%PORT% ^
  -Jprotocol=%PROTOCOL% ^
  -Jpath=%APIPATH% ^
  -Jthreads=%THREADS% ^
  -Jrpm=%RPM% ^
  -Jduration=%DURATION% ^
  -Jcsvfile=%CD%/users.csv ^
  -Jjmeter.save.saveservice.response_data=false

echo Report: %OUT%\report\index.html
endlocal
