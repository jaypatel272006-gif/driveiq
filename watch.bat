@echo off
set PATH=C:\Program Files\Git\cmd;C:\Program Files\GitHub CLI;%PATH%
echo =========================================================
echo   DriveIQ Real-Time Auto-Push Watcher Active 🚀
echo =========================================================
powershell -ExecutionPolicy Bypass -File "%~dp0watch.ps1"
