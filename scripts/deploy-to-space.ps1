# Deploy future-of-collaboration.zopack.md to etok.zo.space via Zo API.
# Requires ZO_API_KEY (Settings → Advanced → Access Tokens).
#
# Usage:
#   $env:ZO_API_KEY = "zo_sk_..."
#   .\scripts\deploy-to-space.ps1
#   .\scripts\deploy-to-space.ps1 -UpgradeWebhook   # also refresh /api/github-webhook from zo-gh policy branch
#   .\scripts\deploy-to-space.ps1 -VerifyOnly       # check live bundle markers only

param(
    [switch]$UpgradeWebhook,
    [switch]$VerifyOnly,
    [string]$Handle = "etok"
)

$ErrorActionPreference = "Stop"
$RepoDir = Split-Path -Parent $PSScriptRoot
$Pack = Join-Path $RepoDir "future-of-collaboration.zopack.md"

function Test-LiveRoute {
    $html = (Invoke-WebRequest -Uri "https://$Handle.zo.space/future-of-collaboration" -UseBasicParsing).Content
    if ($html -notmatch 'index-([A-Za-z0-9_-]+)\.js') { return @{ ok = $false; reason = "no index chunk" } }
    $chunk = $Matches[1]
    $body = (Invoke-WebRequest -Uri "https://$Handle.zo.space/assets/index-$chunk.js" -UseBasicParsing).Content
    $markers = @{
        "TileDetail" = [bool]($body -match "TileDetail")
        "findCuboid" = [bool]($body -match "findCuboid")
        "zo.collab" = [bool]($body -match "zo\.collab")
        "300px" = [bool]($body -match "300px")
        "200px" = [bool]($body -match "200px")
    }
    $ok = $markers["TileDetail"] -and $markers["findCuboid"] -and $markers["300px"] -and -not $markers["200px"]
    return @{ ok = $ok; chunk = $chunk; markers = $markers }
}

if ($VerifyOnly) {
    $r = Test-LiveRoute
    $r | ConvertTo-Json -Depth 4
    exit $(if ($r.ok) { 0 } else { 1 })
}

$key = $env:ZO_API_KEY
if (-not $key) {
    Write-Error "ZO_API_KEY is not set. Create a token in Zo Settings → Advanced, then:`n  `$env:ZO_API_KEY = 'zo_sk_...'`n  .\scripts\deploy-to-space.ps1"
}

$auth = if ($key -match '^Bearer ') { $key } else { "Bearer $key" }

function Invoke-ZoAsk([string]$Input) {
    $body = @{
        input = $Input
    } | ConvertTo-Json -Compress
    $resp = Invoke-RestMethod -Uri "https://api.zo.computer/zo/ask" -Method POST `
        -Headers @{ Authorization = $auth; "Content-Type" = "application/json"; Accept = "application/json" } `
        -Body $body
    return $resp
}

$syncPrompt = @"
Deploy the Future of Collaboration pack to $Handle.zo.space.

1. cd to the clone at code/github.com/EthanThatOneKid/zo-future-of-collaboration (pull main if present).
2. Open future-of-collaboration.zopack.md and extract the /future-of-collaboration page route (tsx fenced block under the route header).
3. write_space_route path=/future-of-collaboration route_type=page public=true with the FULL extracted source (must be at least 1200 lines). Do NOT use an esbuild wrapper or thin stub. The route must include GlobeStage, findCuboidSubdivisions, and TileDetailPanel.
4. restart_space_server if available after write.
5. get_space_route path=/future-of-collaboration — confirm line count >= 1200 and substrings GlobeStage, findCuboidSubdivisions, lg:grid-cols-[300px_1fr].
6. get_space_errors() — report any errors.
7. curl -sI https://$Handle.zo.space/future-of-collaboration and confirm HTTP 200.

The pack on main uses the pre-compact shell (300px sidebar, dual-line header, 48dvh globe row). Do not change unrelated routes.
"@

Write-Host "Dispatching Zo agent to deploy /future-of-collaboration..." -ForegroundColor Cyan
$deploy = Invoke-ZoAsk $syncPrompt
Write-Host ($deploy | ConvertTo-Json -Depth 6)

if ($UpgradeWebhook) {
    $whPrompt = @"
Upgrade the GitHub webhook on $Handle.zo.space to the policy-driven zo-gh handler.

1. In code/github.com/EthanThatOneKid/zo-gh, fetch and checkout branch feat/policy-driven-events (or read webhook-agent/api-github-webhook.ts from that branch on GitHub).
2. write_space_route path=/api/github-webhook route_type=api with the full contents of webhook-agent/api-github-webhook.ts from that branch.
3. Confirm GITHUB_WEBHOOK_SECRET and ZO_API_KEY remain configured in Zo Secrets.
4. get_space_errors() for /api/github-webhook.

This handler reads .zo-gh.yml from pushed repos and dispatches sync agents when .zopack.md files change on main.
"@
    Write-Host "Dispatching Zo agent to upgrade /api/github-webhook..." -ForegroundColor Cyan
    $wh = Invoke-ZoAsk $whPrompt
    Write-Host ($wh | ConvertTo-Json -Depth 6)
}

Write-Host "Waiting 15s for space rebuild..." -ForegroundColor DarkGray
Start-Sleep -Seconds 15
$live = Test-LiveRoute
Write-Host "Live verification:" -ForegroundColor Cyan
$live | ConvertTo-Json -Depth 4
if (-not $live.ok) {
    Write-Warning "Live site may still be on an older build. Hard-refresh https://$Handle.zo.space/future-of-collaboration"
    exit 1
}
Write-Host "Deploy verified." -ForegroundColor Green
