@echo off
setlocal

REM Set the starting directory to the location of the batch file
set "startDir=%~dp0"

REM Store the script name
set "scriptName=%~nx0"

REM Traverse subdirectories and delete files that do not have .mohidden extension
for /r "%startDir%" %%G in (*) do (
    if /i not "%%~xG"==".mohidden" if /i not "%%~nxG"=="%scriptName%" del "%%G"
)

REM Remove empty directories
:RemoveEmptyDirs
set "deleted=0"
for /f "delims=" %%D in ('dir "%startDir%" /ad /s /b ^| sort /r') do (
    rmdir "%%D" 2>nul && set "deleted=1"
)
if "%deleted%"=="1" goto RemoveEmptyDirs

endlocal
echo Finished!
pause
