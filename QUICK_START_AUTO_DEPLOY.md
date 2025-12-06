# 🚀 Quick Start: Enable GitHub Auto-Deploy

**Time Required:** 15 minutes  
**Difficulty:** Easy

---

## ⚡ 3 Simple Steps

### Step 1: Open Your Firebase Token File
📁 **File:** `firebase-token.txt` (in this folder)

Copy the long token that starts with `1//`

---

### Step 2: Add Secrets to GitHub

🌐 **URL:** https://github.com/aamirshehzad9/GentleOmegaAI/settings/secrets/actions

Click **"New repository secret"** and add these 9 secrets:

#### Copy-Paste from Files:

1. **FIREBASE_TOKEN**  
   → Get from: `firebase-token.txt`

2. **VITE_GEMINI_API_KEY**  
   → Get from: `.env.local` (line 2)

3. **VITE_FIREBASE_API_KEY**  
   → Get from: `.env.local` (line 5)

4. **VITE_FIREBASE_AUTH_DOMAIN**  
   → Get from: `.env.local` (line 6)

5. **VITE_FIREBASE_PROJECT_ID**  
   → Get from: `.env.local` (line 7)

6. **VITE_FIREBASE_STORAGE_BUCKET**  
   → Get from: `.env.local` (line 8)

7. **VITE_FIREBASE_MESSAGING_SENDER_ID**  
   → Get from: `.env.local` (line 9)

8. **VITE_FIREBASE_APP_ID**  
   → Get from: `.env.local` (line 10)

9. **VITE_FIREBASE_MEASUREMENT_ID**  
   → Get from: `.env.local` (line 11)

**Tip:** Use `SECRETS_COPY_PASTE.md` for easier copy-paste!

---

### Step 3: Test It

🧪 **Test URL:** https://github.com/aamirshehzad9/GentleOmegaAI/actions

1. Click **"Deploy to Firebase Hosting"**
2. Click **"Run workflow"** button
3. Click **"Run workflow"** to confirm
4. Wait 2-3 minutes ⏱️
5. ✅ Check your site: https://gentleomegaai-space.web.app

---

## 🎉 That's It!

Once working, enable auto-deploy by editing `.github/workflows/firebase-deploy.yml`:

**Change line 10 from:**
```yaml
  workflow_dispatch:  # Only run manually
```

**To:**
```yaml
  workflow_dispatch:  # Only run manually
  push:
    branches:
      - main
```

Then every `git push` will auto-deploy! 🚀

---

## 📚 Need More Help?

- **Detailed Guide:** `GITHUB_SECRETS_SETUP.md`
- **Troubleshooting:** `AUTO_DEPLOY_IMPLEMENTATION.md`
- **Quick Reference:** `SECRETS_COPY_PASTE.md`

---

**Status:** ✅ Implementation Complete  
**Next:** Add 9 secrets to GitHub (15 min)
