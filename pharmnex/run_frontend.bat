@echo off
echo ===================================================
echo   Starting PharmnEx Next.js Frontend (Port 3000)
echo ===================================================
cd /d "%~dp0\apps\web"
echo [INFO] Launching Next.js dev server on http://localhost:3000 ...
npm run dev
pause
