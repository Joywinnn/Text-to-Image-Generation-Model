@echo off
echo.
echo ========================================
echo    Imagify - AI Image Generation
echo ========================================
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found! Version:
node --version

echo.
echo Checking if npm is installed...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed!
    pause
    exit /b 1
)

echo npm found! Version:
npm --version

echo.
echo ========================================
echo    Starting Development Servers
echo ========================================
echo.

echo Starting both frontend and backend servers...
echo Frontend will be available at: http://localhost:5173
echo Backend API will be available at: http://localhost:4000
echo.
echo Press Ctrl+C to stop both servers
echo.

npm run dev

pause 