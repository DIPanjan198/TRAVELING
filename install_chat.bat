@echo off
echo ====================================================
echo Installing Backend Dependencies (socket.io)
echo ====================================================
cd /d "d:\travel-buddy-finder\Server"
call npm install

echo.
echo ====================================================
echo Installing Frontend Dependencies (socket.io-client)
echo ====================================================
cd /d "d:\travel-buddy-finder\client"
call npm install

echo.
echo ====================================================
echo ALL DONE! You can now start both servers as usual.
echo ====================================================
pause
