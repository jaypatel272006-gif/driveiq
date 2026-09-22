# DriveIQ Real-Time Background File Watcher & Auto-Push Engine
$env:PATH = "C:\Program Files\Git\cmd;C:\Program Files\GitHub CLI;" + $env:PATH

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "  DriveIQ Real-Time Auto-Push Watcher Active 🚀  " -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "Monitoring codebase for file changes..." -ForegroundColor Green
Write-Host "Any edits made by AI or developer will automatically push to GitHub & Live Site." -ForegroundColor Yellow
Write-Host "Press Ctrl+C at any time to stop watching." -ForegroundColor Gray
Write-Host "---------------------------------------------------------" -ForegroundColor Gray

$folderToWatch = Join-Path $PSScriptRoot "src"
$filter = "*.*"

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $folderToWatch
$watcher.Filter = $filter
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

$lastPushTime = [DateTime]::MinValue

while ($true) {
    $result = $watcher.WaitForChanged([System.IO.WatcherChangeTypes]::Changed -or [System.IO.WatcherChangeTypes]::Created -or [System.IO.WatcherChangeTypes]::Deleted, 2000)
    
    if ($result.TimedOut -eq $false) {
        # Debounce: wait 2 seconds after edits stop
        Start-Sleep -Seconds 2
        
        $status = git status --porcelain
        if ($status) {
            $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            Write-Host "`n[CHANGE DETECTED] $timestamp" -ForegroundColor Cyan
            Write-Host "1/2 Staging and committing changes..." -ForegroundColor Green
            git add .
            git commit -m "Auto-sync update ($timestamp)"
            
            Write-Host "2/2 Pushing to GitHub & Live Website..." -ForegroundColor Green
            git push
            
            Write-Host "✅ Live Website & GitHub Updated Successfully!`n" -ForegroundColor Green
        }
    }
}
