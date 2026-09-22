@echo off
set PATH=C:\Program Files\Git\cmd;C:\Program Files\GitHub CLI;%PATH%
powershell -ExecutionPolicy Bypass -File "%~dp0save.ps1"
