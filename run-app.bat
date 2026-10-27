@echo off
title FindMyTeam - Start Platform
echo ===================================================
echo Starting FindMyTeam Platform (Backend + Frontend)
echo ===================================================
echo.

echo 1. Starting Backend Express Server on port 5000...
start "FindMyTeam Server (Port 5000)" cmd /k "cd server && npm start"

timeout /t 3 /nobreak >nul

echo 2. Starting Frontend React/Vite Client on port 5173...
start "FindMyTeam Client (Port 5173)" cmd /k "cd client && npm run dev"

echo.
echo Both servers are launching!
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
pause
