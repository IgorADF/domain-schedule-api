@echo off
set PORT=%1

if "%PORT%"=="" (
  echo Uso: kill-port ^<porta^>
  echo Exemplo: kill-port 3000
  exit /b 1
)

echo Procurando processo usando a porta %PORT%...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%PORT% ^| findstr LISTENING') do (
  echo Matando processo PID %%a na porta %PORT%
  taskkill /PID %%a /F
  exit /b 0
)

echo Nenhum processo encontrado usando a porta %PORT%
