# Launch review hub + all zopack demos (ports 5300 hub, 5301+ demos).
$Repo = (Resolve-Path "$PSScriptRoot\..").Path
Set-Location $Repo
Write-Host "Launching review servers (this takes ~30-60s)..."
bun "$Repo\scripts\launch-review.ts"
