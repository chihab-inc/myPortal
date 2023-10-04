@echo off
setlocal

REM Check if the node.exe file exists in the current directory
IF NOT EXIST "%cd%\node.exe" (
    echo Node executable not found. Downloading...
    REM Download the latest version of Node.js
    bitsadmin /transfer "NodeDownload" https://nodejs.org/dist/latest/win-x64/node.exe "%cd%\\node.exe"
)

REM Run the index.js file with Node.js
node index.js

endlocal