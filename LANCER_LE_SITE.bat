@echo off
title HR WEAR - Serveur local
color 0A

cd /d "%~dp0"

echo.
echo  HR WEAR - Lancement du serveur
echo  ================================
echo.

:: Chercher Node.js dans les emplacements habituels
SET NODE_PATH=
IF EXIST "C:\Program Files\nodejs\node.exe" SET NODE_PATH=C:\Program Files\nodejs
IF EXIST "C:\Program Files (x86)\nodejs\node.exe" SET NODE_PATH=C:\Program Files (x86)\nodejs

IF NOT "%NODE_PATH%"=="" (
    SET PATH=%NODE_PATH%;%PATH%
    echo  Node.js trouve : %NODE_PATH%
) ELSE (
    echo  Recherche de node via PATH system...
)

echo.
echo  Version Node.js :
node --version
IF ERRORLEVEL 1 (
    echo.
    echo  ERREUR : Node.js introuvable.
    echo  Redemarrez votre ordinateur apres l'installation de Node.js.
    echo.
    pause
    exit
)

echo.
echo  Demarrage du serveur Next.js...
echo  Attendez le message "Ready" puis allez sur http://localhost:3000
echo.

node node_modules\.bin\next dev

echo.
echo  Le serveur s'est arrete. Appuyez sur une touche pour fermer.
pause
