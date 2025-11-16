setlocal enabledelayedexpansion

:: List of all Visual C++ Redistributables to install
set "VERSIONS=2005.x86,2005.x64,2008.x86,2008.x64,2010.x86,2010.x64,2012.x86,2012.x64,2013.x86,2013.x64,2015+.x86,2015+.x64"

echo Installing Visual C++ Redistributables…
echo.

for %%V in (%VERSIONS%) do (
    echo --------------------------------------------------
    echo Installing Microsoft.VCRedist.%%V …
    winget install --id Microsoft.VCRedist.%%V --force --exact --accept-source-agreements --accept-package-agreements
    if errorlevel 1 (
        echo ERROR: Microsoft.VCRedist.%%V failed to install.
    ) else (
        echo Microsoft.VCRedist.%%V installed successfully.
    )
    timeout /t 2 /nobreak > nul
)

echo --------------------------------------------------
echo Installation complete!
echo.

endlocal
pause