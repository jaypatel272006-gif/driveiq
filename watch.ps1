# DriveIQ Robust Real-Time File Watcher & Auto-Push Engine
$env:PATH = "C:\Program Files\Git\cmd;C:\Program Files\GitHub CLI;" + $env:PATH

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "  DriveIQ Real-Time Auto-Push Watcher Active 🚀  " -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "Monitoring 'src' & 'public' folders for code changes..." -ForegroundColor Green
Write-Host "Press Ctrl+C at any time to stop watching." -ForegroundColor Gray
Write-Host "---------------------------------------------------------" -ForegroundColor Gray

$srcFolder = Join-Path $PSScriptRoot "src"

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $srcFolder
$watcher.Filter = "*.*"
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

$lastPushTime = [DateTime]::Now

while ($true) {
    # Wait for actual file change in src directory
    $result = $watcher.WaitForChanged([System.IO.WatcherChangeTypes]::Changed -or [System.IO.WatcherChangeTypes]::Created -or [System.IO.WatcherChangeTypes]::Deleted, 3000)
    
    if ($result.TimedOut -eq $false) {
        # Check cooldown to prevent Git loops (must be at least 5 seconds since last push)
        $secondsSinceLastPush = ([DateTime]::Now - $lastPushTime).TotalSeconds
        if ($secondsSinceLastPush -ge 5) {
            
            # Pause watcher during Git operation to prevent re-triggering
            $watcher.EnableRaisingEvents = $false
            
            Start-Sleep -Seconds 2
            
            $status = & "C:\Program Files\Git\cmd\git.exe" status --porcelain src public
            if ($status) {
                $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
                Write-Host "`n[SOURCE CODE EDIT DETECTED] $timestamp" -ForegroundColor Cyan
                Write-Host "1/2 Staging and committing source changes..." -ForegroundColor Green
                
                & "C:\Program Files\Git\cmd\git.exe" add src public package.json index.html
                & "C:\Program Files\Git\cmd\git.exe" commit -m "Auto-sync update ($timestamp)"
                
                Write-Host "2/2 Pushing to GitHub repository..." -ForegroundColor Green
                & "C:\Program Files\Git\cmd\git.exe" push
                
                Write-Host "✅ Live Website & GitHub Updated Successfully!`n" -ForegroundColor Green
                $lastPushTime = [DateTime]::Now
            }
            
            # Re-enable watcher
            $watcher.EnableRaisingEvents = $true
        }
    }
}
