@echo off
cd /d "%~dp0"
set "F=%~dp0index.html"
for %%P in ("%ProgramFiles%\Google\Chrome\Application\chrome.exe" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" "%LocalAppData%\Google\Chrome\Application\chrome.exe" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe") do (
  if exist %%P (
    start "" %%P --app="file:///%F:\=/%"
    exit /b
  )
)
start "" "%F%"
