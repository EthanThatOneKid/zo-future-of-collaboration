# Stop zopack review servers on ports 5300-5330.
5300..5330 | ForEach-Object {
  $port = $_
  Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty OwningProcess -Unique |
    ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
}
Write-Host "Stopped processes on ports 5300-5330."
