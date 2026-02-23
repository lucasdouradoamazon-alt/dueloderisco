@echo off
echo ========================================
echo  DUelo de Risco - Ambiente Virtual
echo ========================================
call .\venv\Scripts\activate
echo.
echo ✅ Ambiente virtual ATIVADO!
echo Python: 
python --version
echo.
echo Comandos disponiveis:
echo   pip install -r requirements.txt
echo   python scripts/seed_data.py
echo   deactivate  (para sair)
echo.
cmd /k
