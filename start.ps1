# ── Scientis-Hunt startup script ────────────────────────────────────────────
# Kills stale processes on :3000 and :8080, starts MongoDB if not running,
# then launches both backend and frontend via npm run dev.

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Kill-Port([int]$port) {
    $procs = netstat -ano | Select-String ":$port\s+.*LISTENING" |
        ForEach-Object { ($_ -split '\s+')[-1] } | Sort-Object -Unique
    foreach ($procId in $procs) {
        if ($procId -match '^\d+$' -and [int]$procId -ne 0) {
            Write-Host "  Killing PID $procId on :$port"
            Stop-Process -Id ([int]$procId) -Force -ErrorAction SilentlyContinue
        }
    }
}

Write-Host "`n[1/3] Clearing ports 3000 and 8080..."
Kill-Port 3000
Kill-Port 8080
Start-Sleep -Seconds 1

Write-Host "`n[2/3] Ensuring MongoDB is running..."
$mongoService = Get-Service -Name 'MongoDB' -ErrorAction SilentlyContinue
if ($mongoService) {
    if ($mongoService.Status -ne 'Running') {
        Start-Service 'MongoDB'
        Start-Sleep -Seconds 3
        Write-Host "  MongoDB service started."
    } else {
        Write-Host "  MongoDB service already running."
    }
} else {
    # Try starting mongod directly (community edition default path)
    $mongoPaths = @(
        'C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe',
        'C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe',
        'C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe'
    )
    $started = $false
    foreach ($path in $mongoPaths) {
        if (Test-Path $path) {
            $dataDir = 'C:\data\db'
            if (-not (Test-Path $dataDir)) { New-Item -ItemType Directory -Path $dataDir | Out-Null }
            Write-Host "  Starting mongod from $path..."
            Start-Process $path -ArgumentList "--dbpath `"$dataDir`"" -WindowStyle Hidden
            Start-Sleep -Seconds 4
            $started = $true
            break
        }
    }
    if (-not $started) {
        Write-Warning "  MongoDB not found as a service or in common paths."
        Write-Warning "  Please start MongoDB manually before the backend can connect."
    }
}

Write-Host "`n[3/3] Starting Scientis-Hunt (backend + frontend)..."
Set-Location "$PSScriptRoot"
npm run dev
