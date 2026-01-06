@echo off
set PORT=%1

if "%PORT%"=="" (
  echo Uso: kill-port ^<porta^>
  echo Exemplo: kill-port 3000
  exit /b 1
)

echo Finding port %PORT%...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%PORT% ^| findstr LISTENING') do (
  echo Killing process PID %%a on port %PORT%
  taskkill /PID %%a /F
  exit /b 0
)

echo No process found using port %PORT%
