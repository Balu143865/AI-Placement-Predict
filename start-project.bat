@echo off
title AI Placement Readiness Predictor - Launcher
color 0A
cls

echo ============================================================
echo        AI Placement Readiness Predictor - Launcher
echo ============================================================
echo.

:: Get the directory where this batch file is located
set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

echo [1/4] Checking prerequisites...
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js is installed

:: Check if Python is installed
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed!
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)
echo [OK] Python is installed

:: Check if MongoDB data directory exists
if not exist "C:\data\db" (
    echo [WARNING] MongoDB data directory not found at C:\data\db
    echo Creating directory...
    mkdir "C:\data\db" 2>nul
)

echo.
echo [2/4] Starting MongoDB...
echo.

:: Check if MongoDB is already running
tasklist /FI "IMAGENAME eq mongod.exe" 2>nul | find /I "mongod.exe" >nul
if %errorlevel% equ 0 (
    echo [OK] MongoDB is already running
) else (
    start "MongoDB Server" mongod --dbpath="C:\data\db"
    timeout /t 3 /nobreak >nul
    echo [OK] MongoDB started
)

echo.
echo [3/4] Starting Flask Backend Server...
echo.

:: Set environment variable for UTF-8 encoding
set PYTHONIOENCODING=utf-8

:: Start Flask backend in a new window
start "Flask Backend Server (Port 5000)" cmd /k "cd /d "%PROJECT_DIR%" && set PYTHONIOENCODING=utf-8 && python unified_app.py"
timeout /t 3 /nobreak >nul
echo [OK] Flask backend started on http://localhost:5000

echo.
echo [4/4] Starting React Frontend...
echo.

:: Check if node_modules exists in client directory
if not exist "%PROJECT_DIR%client\node_modules" (
    echo [INFO] Installing frontend dependencies...
    cd /d "%PROJECT_DIR%client"
    call npm install
    cd /d "%PROJECT_DIR%"
)

:: Start React frontend in a new window
start "React Frontend (Port 3000)" cmd /k "cd /d "%PROJECT_DIR%client" && npm start"
echo [OK] React frontend started on http://localhost:3000

echo.
echo ============================================================
echo                    All Services Started!
echo ============================================================
echo.
echo  MongoDB:     http://localhost:27017
echo  Backend:     http://localhost:5000
echo  Frontend:    http://localhost:3000
echo.
echo  The application will open in your browser shortly...
echo.
echo  Press any key to open the application in your browser
echo  (Or close this window - services will keep running)
echo ============================================================
pause >nul

:: Open the application in the default browser
start http://localhost:3000

echo.
echo [INFO] Browser opened. You can close this window.
echo        To stop all services, close the MongoDB, Flask, and React windows.
pause
