@echo off
echo ========================================
echo   GitHub Secrets Setup Helper
echo ========================================
echo.
echo This script will help you add secrets to GitHub.
echo.
echo Prerequisites:
echo 1. Install GitHub CLI: winget install GitHub.cli
echo 2. Login to GitHub: gh auth login
echo.
echo Press any key to continue or Ctrl+C to exit...
pause > nul

echo.
echo Checking if GitHub CLI is installed...
where gh >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: GitHub CLI not found!
    echo.
    echo Install it with: winget install GitHub.cli
    echo Or download from: https://cli.github.com/
    echo.
    pause
    exit /b 1
)

echo OK: GitHub CLI found!
echo.

echo Checking authentication...
gh auth status >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Not logged in to GitHub!
    echo.
    echo Please run: gh auth login
    echo.
    pause
    exit /b 1
)

echo OK: Authenticated!
echo.

echo ========================================
echo   Adding Secrets to GitHub Repository
echo ========================================
echo.

echo [1/9] Adding FIREBASE_TOKEN...
echo Please add FIREBASE_TOKEN manually from firebase-token.txt file
echo The token was displayed when you ran: firebase login:ci
echo.
echo To continue, press any key after adding FIREBASE_TOKEN to GitHub...
pause > nul
echo.

echo [2/9] Adding VITE_GEMINI_API_KEY...
gh secret set VITE_GEMINI_API_KEY --body "AIzaSyDqNvjae8XTGlWVCHOnqF8PinGTZ7tDif8"
echo.

echo [3/9] Adding VITE_FIREBASE_API_KEY...
gh secret set VITE_FIREBASE_API_KEY --body "AIzaSyCrNsJqhpox9gD8PxKeGFFN0Naz9sbdhcs"
echo.

echo [4/9] Adding VITE_FIREBASE_AUTH_DOMAIN...
gh secret set VITE_FIREBASE_AUTH_DOMAIN --body "gentleomegaai.firebaseapp.com"
echo.

echo [5/9] Adding VITE_FIREBASE_PROJECT_ID...
gh secret set VITE_FIREBASE_PROJECT_ID --body "gentleomegaai"
echo.

echo [6/9] Adding VITE_FIREBASE_STORAGE_BUCKET...
gh secret set VITE_FIREBASE_STORAGE_BUCKET --body "gentleomegaai.firebasestorage.app"
echo.

echo [7/9] Adding VITE_FIREBASE_MESSAGING_SENDER_ID...
gh secret set VITE_FIREBASE_MESSAGING_SENDER_ID --body "147777473845"
echo.

echo [8/9] Adding VITE_FIREBASE_APP_ID...
gh secret set VITE_FIREBASE_APP_ID --body "1:147777473845:web:6d40ee4e2677ce6118107c"
echo.

echo [9/9] Adding VITE_FIREBASE_MEASUREMENT_ID...
gh secret set VITE_FIREBASE_MEASUREMENT_ID --body "G-JX59CLY5JR"
echo.

echo ========================================
echo   SUCCESS! All secrets added!
echo ========================================
echo.
echo Verification:
echo Visit: https://github.com/aamirshehzad9/GentleOmegaAI/settings/secrets/actions
echo.
echo You should see all 9 secrets listed.
echo.
echo Next Steps:
echo 1. Verify secrets on GitHub (link above)
echo 2. Enable auto-deploy: Edit .github/workflows/firebase-deploy.yml
echo 3. Test deployment: Push a commit or trigger manually
echo.
echo To list current secrets:
echo   gh secret list
echo.
pause
