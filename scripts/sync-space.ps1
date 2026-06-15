# Extracts the /future-of-collaboration route from future-of-collaboration.zopack.md
# for manual paste into the Zo Space route editor or deploy-to-space.ps1.
#
# Usage:
#   .\scripts\sync-space.ps1           # print route code to stdout
#   .\scripts\sync-space.ps1 -PathOnly # print temp file path only

param(
    [switch]$PathOnly
)

$ErrorActionPreference = "Stop"
$RepoDir = Split-Path -Parent $PSScriptRoot
$Pack = Join-Path $RepoDir "future-of-collaboration.zopack.md"
$Out = [System.IO.Path]::GetTempFileName() -replace '\.tmp$', '.tsx'

Push-Location $RepoDir
try {
    git pull --ff-only 2>&1 | ForEach-Object { Write-Host $_ }
} catch {
    Write-Host "git pull skipped or failed: $_"
}
Pop-Location

$lines = Get-Content $Pack
$start = ($lines | Select-String -Pattern '^### `/future-of-collaboration`' | Select-Object -First 1).LineNumber
if (-not $start) {
    throw "Could not find route block in $Pack"
}

# Skip header line, opening ```tsx fence, and closing ``` fence
$routeLines = $lines[($start)..($lines.Count - 1)]
$routeLines = $routeLines | Select-Object -Skip 2
if ($routeLines[-1] -match '^```') { $routeLines = $routeLines[0..($routeLines.Length - 2)] }

$routeLines | Set-Content -Path $Out -Encoding utf8
$bytes = (Get-Item $Out).Length
$count = $routeLines.Count
Write-Host "# Extracted $count lines / $bytes bytes from $Pack" -ForegroundColor DarkGray
Write-Host "# Saved to: $Out" -ForegroundColor DarkGray

if ($PathOnly) {
    Write-Output $Out
} else {
    Get-Content $Out -Raw
}
