$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$python = "C:\Users\uaham\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
$dist = Join-Path $root "dist"

if (-not (Test-Path -LiteralPath $dist)) {
  Write-Host "dist 폴더가 없습니다. 먼저 npm.cmd run build 를 실행해주세요."
  exit 1
}

Write-Host "현미샘 디지털 교실 미리보기 서버를 시작합니다."
Write-Host "주소: http://127.0.0.1:5173/"

& $python -m http.server 5173 --bind 127.0.0.1 --directory $dist
