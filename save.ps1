# DriveIQ Auto-Save & Vercel Sync Script
$env:PATH = "C:\Program Files\Git\cmd;" + $env:PATH

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  DriveIQ Auto-Save & Deploy Engine  " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Check Git Status
$status = git status --porcelain
if (-not $status) {
    Write-Host "[INFO] No uncommitted code changes detected." -ForegroundColor Yellow
} else {
    Write-Host "[1/3] Staging code changes..." -ForegroundColor Green
    git add .
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $commitMsg = "Update DriveIQ codebase ($timestamp)"
    
    Write-Host "[2/3] Saving changes to Git repository ($commitMsg)..." -ForegroundColor Green
    git commit -m "$commitMsg"
    
    # Try pushing if remote repository is connected
    $remote = git remote
    if ($remote) {
        Write-Host "[3/3] Pushing to remote GitHub / Git repository..." -ForegroundColor Green
        git push
    }
}

# 2. Deploy to Vercel Cloud
Write-Host "Deploying latest changes to Vercel 24/7 Cloud..." -ForegroundColor Cyan
npx vercel --prod

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Success! Changes saved & deployed 24/7! " -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
