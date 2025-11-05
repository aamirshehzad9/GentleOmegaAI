# 🚀 Gentle Ωmega AI - Deployment Guide

## ✅ Project Status
- ✅ Login/Signup pages created
- ✅ QR Code functionality added
- ✅ Payment checkout page ready
- ✅ Firebase configuration done
- ✅ GitHub Actions auto-deployment configured

---

## 📋 Prerequisites
- Google account (for Firebase)
- GitHub repository (already set up)
- Domain: gentleomegaai.space (Hostinger)

---

## 🔥 Firebase Setup (One-time - 15 minutes)

### Step 1: Install Firebase CLI
```powershell
npm install -g firebase-tools
```

### Step 2: Login to Firebase
```powershell
firebase login
```
- Opens browser
- Login with your Google account

### Step 3: Initialize Firebase Project

**Option A: Create New Project**
```powershell
firebase init hosting
```

Answer questions:
- ✅ Use existing project or create new? → **Create new project**
- ✅ Project name: `gentleomegaai`
- ✅ Public directory: `dist`
- ✅ Single-page app: `Yes`
- ✅ GitHub auto-deploy: `Yes` (if asked)

**Option B: Use Existing Project** (if you already have Firebase project)
```powershell
firebase use --add
```
- Select your project
- Give it an alias: `production`

### Step 4: Update .firebaserc
```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

---

## 🌐 Manual Deployment (First Time)

### Build the project
```powershell
npm run build
```

### Deploy to Firebase
```powershell
firebase deploy --only hosting
```

**Result:**
- ✅ Live URL: `https://your-project-id.web.app`
- ✅ Alternative: `https://your-project-id.firebaseapp.com`

---

## 🔗 Custom Domain Setup (gentleomegaai.space)

### Step 1: In Firebase Console
1. Go to: https://console.firebase.google.com
2. Select your project
3. Hosting → Add custom domain
4. Enter: `gentleomegaai.space`
5. Enter: `www.gentleomegaai.space`

### Step 2: Firebase gives you DNS records

Example:
```
Type: A
Name: @
Value: 151.101.1.195

Type: A
Name: @
Value: 151.101.65.195

Type: A
Name: www
Value: 151.101.1.195

Type: A
Name: www
Value: 151.101.65.195
```

### Step 3: Update Hostinger DNS
1. Login to Hostinger
2. Go to: Domains → gentleomegaai.space → DNS
3. Add the A records from Firebase
4. Save changes

**Wait:** 10-30 minutes for DNS propagation

---

## ⚡ Auto-Deployment Setup (GitHub Actions)

### Step 1: Get Firebase Service Account

```powershell
# Generate service account key
firebase init hosting:github
```

Or manually:
1. Firebase Console → Project Settings
2. Service Accounts → Generate new private key
3. Download JSON file

### Step 2: Add GitHub Secrets

1. Go to: https://github.com/aamirshehzad9/GentleOmegaAI/settings/secrets/actions
2. Add secrets:

**Required Secrets:**
```
FIREBASE_SERVICE_ACCOUNT
→ Paste entire JSON content from service account file

FIREBASE_PROJECT_ID
→ Your Firebase project ID (e.g., gentleomegaai)

GEMINI_API_KEY
→ AIzaSyAQ0hyUJJNbg-LeVFpwYF7cseWIeF2ML60
```

### Step 3: Test Auto-Deployment

```powershell
# Make a small change
git add .
git commit -m "Test auto-deployment"
git push origin main
```

**Wait 2-3 minutes:**
- GitHub Actions runs
- Builds project
- Deploys to Firebase
- ✅ LIVE!

Check progress: https://github.com/aamirshehzad9/GentleOmegaAI/actions

---

## 📊 Future Workflow

**Daily Development:**
```powershell
# 1. Make changes in VS Code
# 2. Test locally
npm run dev

# 3. Commit & push
git add .
git commit -m "Added new feature"
git push origin main

# 4. Wait 2-3 minutes
# 5. Check: https://gentleomegaai.space
# ✅ LIVE with new changes!
```

---

## 🎯 Testing Checklist

After deployment, test these pages:
- [ ] https://gentleomegaai.space (Home)
- [ ] https://gentleomegaai.space (Click "Log In" button)
- [ ] https://gentleomegaai.space (Click "Sign Up" button)
- [ ] https://gentleomegaai.space (Click "Book Your Slot Now")
- [ ] Login page QR code toggle works
- [ ] All social login buttons show messages

---

## 🆘 Troubleshooting

### Issue: Build fails
```powershell
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Issue: Firebase deployment fails
```powershell
# Re-login
firebase logout
firebase login
firebase deploy --only hosting
```

### Issue: Domain not working
- Wait 24 hours for DNS propagation
- Clear browser cache
- Try incognito mode
- Check DNS: https://dnschecker.org

---

## 📞 Support

If you face any issues:
1. Check Firebase Console logs
2. Check GitHub Actions logs
3. Ask me for help! 😊

---

## ✨ Next Steps (After Deployment)

**Week 1:**
- Monitor traffic
- Collect user feedback
- Test on different devices

**Week 2:**
- Add Firebase Authentication
- Enable real login/signup
- Add user database

**Week 3:**
- Payment gateway integration
- Email notifications
- Analytics setup

---

**🎉 Ready to Go LIVE! 🚀**
