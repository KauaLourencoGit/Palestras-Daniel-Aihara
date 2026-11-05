# Script de inicialização facilitada
$currentDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $currentDir
$env:PYTHONPATH = "src"

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "   Site e Gestão de Palestras — Daniel Takeo Aihara (UNITRI 2026-2)" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Iniciando o servidor local em: http://127.0.0.1:8000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Links úteis:" -ForegroundColor White
Write-Host "  - Site Público:     http://127.0.0.1:8000" -ForegroundColor White
Write-Host "  - Painel do Daniel: http://127.0.0.1:8000/admin" -ForegroundColor White
Write-Host "    (Login: daniel.aihara@exemplo.com / Senha: admin123456)" -ForegroundColor Gray
Write-Host "  - Swagger Docs:     http://127.0.0.1:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "Pressione Ctrl+C para encerrar o servidor quando terminar." -ForegroundColor Gray
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

$venvPython = Join-Path $currentDir ".venv\Scripts\python.exe"
if (Test-Path $venvPython) {
    & $venvPython "src/main.py"
} else {
    python "src/main.py"
}
