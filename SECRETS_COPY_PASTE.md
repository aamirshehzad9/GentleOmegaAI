# 🔑 Quick Copy-Paste: GitHub Secrets

Use this file to quickly copy-paste values when adding secrets manually on GitHub.

---

## 📍 GitHub Secrets URL
**Add secrets here:** https://github.com/aamirshehzad9/GentleOmegaAI/settings/secrets/actions

---

## 📋 Copy-Paste Values (9 Secrets)

### 1. FIREBASE_TOKEN
```
[GET FROM LOCAL FILE: firebase-token.txt]
Run: firebase login:ci
Copy the token that appears after "Success! Use this token..."
```

### 2. VITE_GEMINI_API_KEY
```
AIzaSyDqNvjae8XTGlWVCHOnqF8PinGTZ7tDif8
```

### 3. VITE_FIREBASE_API_KEY
```
AIzaSyCrNsJqhpox9gD8PxKeGFFN0Naz9sbdhcs
```

### 4. VITE_FIREBASE_AUTH_DOMAIN
```
gentleomegaai.firebaseapp.com
```

### 5. VITE_FIREBASE_PROJECT_ID
```
gentleomegaai
```

### 6. VITE_FIREBASE_STORAGE_BUCKET
```
gentleomegaai.firebasestorage.app
```

### 7. VITE_FIREBASE_MESSAGING_SENDER_ID
```
147777473845
```

### 8. VITE_FIREBASE_APP_ID
```
1:147777473845:web:6d40ee4e2677ce6118107c
```

### 9. VITE_FIREBASE_MEASUREMENT_ID
```
G-JX59CLY5JR
```

---

## ✅ Verification Checklist

After adding all secrets, verify:

- [ ] FIREBASE_TOKEN
- [ ] VITE_GEMINI_API_KEY
- [ ] VITE_FIREBASE_API_KEY
- [ ] VITE_FIREBASE_AUTH_DOMAIN
- [ ] VITE_FIREBASE_PROJECT_ID
- [ ] VITE_FIREBASE_STORAGE_BUCKET
- [ ] VITE_FIREBASE_MESSAGING_SENDER_ID
- [ ] VITE_FIREBASE_APP_ID
- [ ] VITE_FIREBASE_MEASUREMENT_ID

**Total:** 9 secrets required

---

## 🎯 What These Secrets Do

| Secret | Purpose |
|--------|---------|
| FIREBASE_TOKEN | Authenticates Firebase CLI for deployment |
| VITE_GEMINI_API_KEY | Powers AI features (blog generation, topics, SEO) |
| VITE_FIREBASE_API_KEY | Frontend Firebase connection |
| VITE_FIREBASE_AUTH_DOMAIN | User authentication domain |
| VITE_FIREBASE_PROJECT_ID | Firebase project identifier |
| VITE_FIREBASE_STORAGE_BUCKET | File upload storage |
| VITE_FIREBASE_MESSAGING_SENDER_ID | Push notifications |
| VITE_FIREBASE_APP_ID | Firebase app identifier |
| VITE_FIREBASE_MEASUREMENT_ID | Google Analytics tracking |

---

## 📝 Manual Steps (GitHub Web UI)

1. Click "New repository secret"
2. Enter the **Name** exactly as shown above
3. Copy the **Value** from above and paste
4. Click "Add secret"
5. Repeat for all 9 secrets

**Time:** ~3-5 minutes for all secrets

---

## 🚀 After Adding Secrets

### Test Manual Deployment:
1. Go to: https://github.com/aamirshehzad9/GentleOmegaAI/actions
2. Click "Deploy to Firebase Hosting"
3. Click "Run workflow" → "Run workflow"
4. Watch the deployment complete (~2-3 minutes)

### Enable Auto-Deploy:
Edit `.github/workflows/firebase-deploy.yml` and change:
```yaml
on:
  workflow_dispatch:  # Current: Manual only
```

To:
```yaml
on:
  push:
    branches:
      - main
  workflow_dispatch:  # Also allow manual triggers
```

Then commit and push. Every future push will auto-deploy! 🎉

---

**Last Updated:** December 6, 2025
