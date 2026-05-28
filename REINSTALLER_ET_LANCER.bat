@echo off
title HR WEAR - Installation et lancement
color 0A

cd /d "%~dp0"

echo.
echo  ====================================
echo   HR WEAR - Etape 1 : Diagnostic
echo  ====================================
echo.

node --version
IF ERRORLEVEL 1 (
    echo.
    echo  [ERREUR] Node.js n'est pas dans le PATH.
    echo  Redemarrez votre PC puis relancez ce fichier.
    echo.
    pause
    exit /b
)

npm --version
IF ERRORLEVEL 1 (
    echo  [ERREUR] npm introuvable.
    pause
    exit /b
)

echo.
echo  ====================================
echo   Etape 2 : Nettoyage node_modules
echo  ====================================
echo.
echo  Suppression des anciens modules (compatibilite Linux/Windows)...
IF EXIST "node_modules" (
    rmdir /s /q node_modules
    echo  Supprime.
) ELSE (
    echo  Rien a supprimer.
)

echo.
echo  ====================================
echo   Etape 3 : Installation (2-3 min)
echo  ====================================
echo.
call npm install
IF ERRORLEVEL 1 (
    echo.
    echo  [ERREUR] npm install a echoue.
    pause
    exit /b
)

echo.
echo  ====================================
echo   Etape 4 : Lancement du site
echo  ====================================
echo.
echo  Ouvrez votre navigateur sur : http://localhost:3000
echo  Admin : http://localhost:3000/admin/login
echo.
echo  (Ne fermez pas cette fenetre)
echo.

call npm run dev

echo.
pause
