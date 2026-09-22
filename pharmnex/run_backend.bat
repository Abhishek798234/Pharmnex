@echo off
echo ===================================================
echo   Starting PharmnEx FastAPI Backend (Port 8000)
echo ===================================================
cd /d "%~dp0\apps\api"

:: Check if seed is needed
python -c "import sqlite3; conn = sqlite3.connect('pharmnex.db'); res = conn.execute('SELECT COUNT(*) FROM participants').fetchone()[0]; exit(0 if res > 0 else 1)" 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Seeding demo database accounts and sample data...
    python seed.py
)

echo [INFO] Launching Uvicorn server on http://127.0.0.1:8000 ...
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
pause
