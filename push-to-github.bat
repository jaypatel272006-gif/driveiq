@echo off
set PATH=C:\Program Files\Git\cmd;C:\Program Files\GitHub CLI;%PATH%
echo =========================================
echo   DriveIQ GitHub Setup ^& Push Helper
echo =========================================
echo.

set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/YourUsername/DriveIQ.git): "

if "%REPO_URL%"=="" (
    echo No URL entered. Exiting.
    pause
    exit /b
)

echo.
echo Adding Git remote origin...
"C:\Program Files\Git\cmd\git.exe" remote remove origin 2>nul
"C:\Program Files\Git\cmd\git.exe" remote add origin %REPO_URL%

echo Renaming branch to main...
"C:\Program Files\Git\cmd\git.exe" branch -M main

echo Pushing code to GitHub...
"C:\Program Files\Git\cmd\git.exe" push -u origin main

echo.
echo =========================================
echo   Done! Your repository is on GitHub!
echo =========================================
pause
