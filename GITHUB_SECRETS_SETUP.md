# 🔐 GitHub Actions Auto-Deploy Setup Guide

## 🎯 Firebase Token Generated!

Your Firebase CI token has been generated. Now you need to add it to GitHub Secrets.

---

## 📝 Step-by-Step: Add Secrets to GitHub

### Required Secrets (9 total)

You need to add these secrets to your GitHub repository:

1. **FIREBASE_TOKEN** - For deployment authentication
2. **VITE_GEMINI_API_KEY** - Your Gemini AI API key
3. **VITE_FIREBASE_API_KEY** - Firebase API key
4. **VITE_FIREBASE_AUTH_DOMAIN** - Firebase auth domain
5. **VITE_FIREBASE_PROJECT_ID** - Firebase project ID
6. **VITE_FIREBASE_STORAGE_BUCKET** - Firebase storage bucket
7. **VITE_FIREBASE_MESSAGING_SENDER_ID** - Firebase messaging sender ID
8. **VITE_FIREBASE_APP_ID** - Firebase app ID
9. **VITE_FIREBASE_MEASUREMENT_ID** - Firebase measurement ID

---

## 🌐 How to Add Secrets on GitHub

### Option 1: Using GitHub Web Interface (Recommended)

1. **Go to your repository:**
   ```
   https://github.com/aamirshehzad9/GentleOmegaAI/settings/secrets/actions
   ```

2. **Click "New repository secret"**

3. **Add each secret one by one:**

   #### Secret #1: FIREBASE_TOKEN
   - **Name:** `FIREBASE_TOKEN`
   - **Value:** `1//035Bbgy3odGwNCgYIARAAGAMSNwF-L9IryBeEP9jbP6m98zjzUjPE9WgJbGHa-8nl6uT4reit0hQOcRFWpEdk AIrKZlIc2rG7vdQ`
   - Click "Add secret"

   #### Secret #2: VITE_GEMINI_API_KEY
   - **Name:** `VITE_GEMINI_API_KEY`
   - **Value:** `AIzaSyDqNvjae8XTGlWVCHOnqF8PinGTZ7tDif8`
   - Click "Add secret"

   #### Secret #3: VITE_FIREBASE_API_KEY
   - **Name:** `VITE_FIREBASE_API_KEY`
   - **Value:** `AIzaSyCrNsJqhpox9gD8PxKeGFFN0Naz9sbdhcs`
   - Click "Add secret"

   #### Secret #4: VITE_FIREBASE_AUTH_DOMAIN
   - **Name:** `VITE_FIREBASE_AUTH_DOMAIN`
   - **Value:** `gentleomegaai.firebaseapp.com`
   - Click "Add secret"

   #### Secret #5: VITE_FIREBASE_PROJECT_ID
   - **Name:** `VITE_FIREBASE_PROJECT_ID`
   - **Value:** `gentleomegaai`
   - Click "Add secret"

   #### Secret #6: VITE_FIREBASE_STORAGE_BUCKET
   - **Name:** `VITE_FIREBASE_STORAGE_BUCKET`
   - **Value:** `gentleomegaai.firebasestorage.app`
   - Click "Add secret"

   #### Secret #7: VITE_FIREBASE_MESSAGING_SENDER_ID
   - **Name:** `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - **Value:** `147777473845`
   - Click "Add secret"

   #### Secret #8: VITE_FIREBASE_APP_ID
   - **Name:** `VITE_FIREBASE_APP_ID`
   - **Value:** `1:147777473845:web:6d40ee4e2677ce6118107c`
   - Click "Add secret"

   #### Secret #9: VITE_FIREBASE_MEASUREMENT_ID
   - **Name:** `VITE_FIREBASE_MEASUREMENT_ID`
   - **Value:** `G-JX59CLY5JR`
   - Click "Add secret"

---

### Option 2: Using GitHub CLI (gh)

If you have GitHub CLI installed:

```bash
# Navigate to your project directory
cd D:\Pro\GentleOmegaAI\GentleOmegaAI

# Add all secrets at once
gh secret set FIREBASE_TOKEN --body "1//035Bbgy3odGwNCgYIARAAGAMSNwF-L9IryBeEP9jbP6m98zjzUjPE9WgJbGHa-8nl6uT4reit0hQOcRFWpEdk AIrKZlIc2rG7vdQ"

gh secret set VITE_GEMINI_API_KEY --body "AIzaSyDqNvjae8XTGlWVCHOnqF8PinGTZ7tDif8"

gh secret set VITE_FIREBASE_API_KEY --body "AIzaSyCrNsJqhpox9gD8PxKeGFFN0Naz9sbdhcs"

gh secret set VITE_FIREBASE_AUTH_DOMAIN --body "gentleomegaai.firebaseapp.com"

gh secret set VITE_FIREBASE_PROJECT_ID --body "gentleomegaai"

gh secret set VITE_FIREBASE_STORAGE_BUCKET --body "gentleomegaai.firebasestorage.app"

gh secret set VITE_FIREBASE_MESSAGING_SENDER_ID --body "147777473845"

gh secret set VITE_FIREBASE_APP_ID --body "1:147777473845:web:6d40ee4e2677ce6118107c"

gh secret set VITE_FIREBASE_MEASUREMENT_ID --body "G-JX59CLY5JR"
```

---

## ✅ Verify Secrets Are Added

1. Go to: https://github.com/aamirshehzad9/GentleOmegaAI/settings/secrets/actions

2. You should see all 9 secrets listed:
   - ✅ FIREBASE_TOKEN
   - ✅ VITE_GEMINI_API_KEY
   - ✅ VITE_FIREBASE_API_KEY
   - ✅ VITE_FIREBASE_AUTH_DOMAIN
   - ✅ VITE_FIREBASE_PROJECT_ID
   - ✅ VITE_FIREBASE_STORAGE_BUCKET
   - ✅ VITE_FIREBASE_MESSAGING_SENDER_ID
   - ✅ VITE_FIREBASE_APP_ID
   - ✅ VITE_FIREBASE_MEASUREMENT_ID

---

## 🚀 Enable Auto-Deploy

After adding all secrets, enable auto-deploy by uncommenting the workflow trigger.

The workflow file has been updated but is still set to `workflow_dispatch` (manual only).

**To enable auto-deploy on every push:**

1. Edit `.github/workflows/firebase-deploy.yml`
2. Change lines 3-10 from:
   ```yaml
   # Temporarily disabled - Deploy manually using: npm run build && firebase deploy
   # on:
   #   push:
   #     branches:
   #       - main

   on:
     workflow_dispatch:  # Only run manually from GitHub Actions tab
   ```

   To:
   ```yaml
   on:
     push:
       branches:
         - main
     workflow_dispatch:  # Also allow manual triggers
   ```

3. Commit and push the change

---

## 🧪 Test the Auto-Deploy

### Method 1: Push a Test Commit
```bash
# Make a small change
echo "# Test auto-deploy" >> README.md

# Commit and push
git add README.md
git commit -m "Test: Verify auto-deploy workflow"
git push origin main
```

Watch the deployment at:
https://github.com/aamirshehzad9/GentleOmegaAI/actions

### Method 2: Manual Trigger (Current Setup)
1. Go to: https://github.com/aamirshehzad9/GentleOmegaAI/actions
2. Click "Deploy to Firebase Hosting" workflow
3. Click "Run workflow" button
4. Click "Run workflow" to confirm

---

## 📊 What Changed in the Workflow

### Old Approach (Service Account - Complex)
```yaml
- name: Deploy to Firebase
  uses: FirebaseExtended/action-hosting-deploy@v0
  with:
    firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}  # ❌ Missing
    projectId: ${{ secrets.FIREBASE_PROJECT_ID }}
```

### New Approach (Firebase Token - Simple) ✅
```yaml
- name: Install Firebase CLI
  run: npm install -g firebase-tools

- name: Deploy to Firebase Hosting
  env:
    FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
  run: firebase deploy --only hosting --project gentleomegaai --token "$FIREBASE_TOKEN"
```

**Benefits:**
- ✅ Simpler setup - just one token
- ✅ No service account JSON needed
- ✅ No complex IAM permissions
- ✅ Works immediately after adding secret
- ✅ Same deployment result

---

## 🔧 Troubleshooting

### If deployment fails:

1. **Check secrets are added:**
   - Visit: https://github.com/aamirshehzad9/GentleOmegaAI/settings/secrets/actions
   - Verify all 9 secrets are present

2. **Check workflow logs:**
   - Visit: https://github.com/aamirshehzad9/GentleOmegaAI/actions
   - Click on the failed run
   - Check which step failed

3. **Verify Firebase token is valid:**
   ```bash
   firebase projects:list --token "YOUR_TOKEN"
   ```

4. **Re-generate token if expired:**
   ```bash
   firebase login:ci
   ```
   Then update the FIREBASE_TOKEN secret on GitHub

---

## 📞 Next Steps

1. ✅ **Add all 9 secrets to GitHub** (use the values provided above)
2. ✅ **Verify secrets are saved** (check GitHub settings)
3. ⏳ **Test manual deployment** (trigger from GitHub Actions tab)
4. ⏳ **Enable auto-deploy** (uncomment workflow trigger lines)
5. ⏳ **Test auto-deploy** (push a commit and watch it deploy)

---

## 🎯 Final Result

Once setup is complete:
- ✅ Every `git push` automatically deploys to Firebase
- ✅ No more manual `npm run build && firebase deploy`
- ✅ No more GitHub error emails
- ✅ Full CI/CD pipeline operational
- ✅ Production always in sync with main branch

**Deployment time:** ~2-3 minutes per push

**URL:** https://gentleomegaai-space.web.app (auto-updated)

---

**Created:** December 6, 2025
**Status:** Ready to implement - Add secrets to complete setup
