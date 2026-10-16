@echo off
title PharmnEx Launcher
echo ========================================================
echo   Launching PharmnEx Platform (Backend + Frontend)
echo ========================================================
echo.

:: Start Backend in separate window
echo [1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "PharmnEx Backend (FastAPI)" cmd /c "%~dp0pharmnex\run_backend.bat"

:: Short delay for backend initialization
timeout /t 3 /nobreak >nul

:: Start Frontend in separate window
echo [2/2] Starting Next.js Web Portal on http://localhost:3000 ...
start "PharmnEx Frontend (Next.js)" cmd /c "%~dp0pharmnex\run_frontend.bat"

echo.
echo ========================================================
echo   PharmnEx services are starting!
echo   - Web Application: http://localhost:3000
echo   - Backend Swagger: http://127.0.0.1:8000/docs
echo   - Demo Accounts:   admin@pharmnex.io / admin123
echo ========================================================
echo.
pause
