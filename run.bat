@echo off
setlocal enabledelayedexpansion
title API Sentinel

echo ====================================================================
echo                   API SENTINEL - SECURITY MONITOR
echo ====================================================================
echo.

:: 1. Check Java
where java >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Java 21 is not found in PATH.
    echo Please install Java 21 LTS and try again.
    pause
    exit /b 1
)

:: 2. Check Node
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js / npm is not found in PATH.
    echo Please install Node.js (v18+) and try again.
    pause
    exit /b 1
)

:: 3. Prepare Backend JAR if missing
if not exist "%~dp0backend\target\api-0.0.1-SNAPSHOT.jar" (
    if exist "%~dp0..\Sentinel-API-backup\backend\target\api-0.0.1-SNAPSHOT.jar" (
        echo [*] Copying compiled backend executable...
        if not exist "%~dp0backend\target" mkdir "%~dp0backend\target"
        copy /Y "%~dp0..\Sentinel-API-backup\backend\target\api-0.0.1-SNAPSHOT.jar" "%~dp0backend\target\api-0.0.1-SNAPSHOT.jar" >nul
    )
)

echo.
echo [*] Launching API Sentinel Backend (Spring Boot :8081)...
start "API Sentinel - Backend Server" cmd /k "cd /d "%~dp0backend" && java -jar target\api-0.0.1-SNAPSHOT.jar --server.port=8081"

echo [*] Launching API Sentinel Frontend (Vite :5173)...
start "API Sentinel - Frontend Dashboard" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ====================================================================
echo   API Sentinel is launching!
echo   Frontend: http://localhost:5173/login
echo   Backend:  http://localhost:8081/api
echo ====================================================================
echo.
