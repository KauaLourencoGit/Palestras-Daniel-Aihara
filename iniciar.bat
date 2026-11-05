@echo off
title Site de Palestras - Daniel Takeo Aihara
cd /d "%~dp0"
set PYTHONPATH=src

echo ======================================================================
echo    Site e Gestao de Palestras - Daniel Takeo Aihara (UNITRI 2026-2)
echo ======================================================================
echo.
echo Iniciando o servidor local em: http://127.0.0.1:8000
echo.
echo Links uteis:
echo   - Site Publico:     http://127.0.0.1:8000
echo   - Painel do Daniel: http://127.0.0.1:8000/admin
echo     (Login: daniel.aihara@exemplo.com / Senha: admin123456)
echo   - Swagger Docs:     http://127.0.0.1:8000/docs
echo.
echo Pressione Ctrl+C para encerrar o servidor quando terminar.
echo ======================================================================
echo.

".venv\Scripts\python.exe" "src\main.py"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Ocorreu um erro ao iniciar. Tentando com o Python do sistema...
    python "src\main.py"
)

pause
