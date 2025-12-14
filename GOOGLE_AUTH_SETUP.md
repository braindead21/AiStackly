# Google OAuth Setup Guide

## 🔐 How to Enable Google Sign-In

Follow these steps to add Google authentication to your AI Stackly app.

---

## Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com

2. **Create a New Project:**
   - Click the project dropdown (top-left)
   - Click "New Project"
   - Name: `AI Stackly` (or your preferred name)
   - Click "Create"

3. **Select Your Project:**
   - Click the project dropdown
   - Select your newly created project

---

## Step 2: Enable Google+ API

1. **Go to APIs & Services:**
   - Click hamburger menu (☰) → "APIs & Services" → "Library"

2. **Enable Required APIs:**
   - Search for "Google+ API"
   - Click on it
   - Click "Enable"

---

## Step 3: Configure OAuth Consent Screen

1. **Go to OAuth Consent Screen:**
   - Click hamburger menu (☰) → "APIs & Services" → "OAuth consent screen"

2. **Choose User Type:**
   - Select "External"
   - Click "Create"

3. **Fill in App Information:**
   - **App name:** AI Stackly
   - **User support email:** Your email
   - **App logo:** (Optional)
   - **Application home page:** http://localhost:3000
   - **Authorized domains:** localhost (for development)
   - **Developer contact:** Your email
   - Click "Save and Continue"

4. **Scopes (Step 2):**
   - Click "Add or Remove Scopes"
   - Select:
     - `userinfo.email`
     - `userinfo.profile`
   - Click "Update"
   - Click "Save and Continue"

5. **Test Users (Step 3):**
   - Add your email as a test user
   - Click "Add Users"
   - Click "Save and Continue"

6. **Summary:**
   - Review and click "Back to Dashboard"

---

## Step 4: Create OAuth Credentials

1. **Go to Credentials:**
   - Click hamburger menu (☰) → "APIs & Services" → "Credentials"

2. **Create OAuth Client ID:**
   - Click "+ Create Credentials"
   - Select "OAuth client ID"

3. **Configure OAuth Client:**
   - **Application type:** Web application
   - **Name:** AI Stackly Web Client
   
   - **Authorized JavaScript origins:**
     - Click "+ Add URI"
     - Add: `http://localhost:3000`
   
   - **Authorized redirect URIs:**
     - Click "+ Add URI"
     - Add: `http://localhost:3000/api/auth/callback/google`
   
   - Click "Create"

4. **Copy Credentials:**
   - A popup will show your credentials
   - **Copy "Client ID"** (looks like: `123456789-abc...googleusercontent.com`)
   - **Copy "Client Secret"** (looks like: `GOCSPX-abc...`)
   - Click "OK"

---

## Step 5: Add Credentials to .env

1. **Open your `.env` file**

2. **Add the credentials:**

```env
# Google OAuth
GOOGLE_CLIENT_ID=paste-your-client-id-here
GOOGLE_CLIENT_SECRET=paste-your-client-secret-here
```

Example:
```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnop123456789
```

3. **Save the file**

---

## Step 6: Restart Dev Server

```bash
# Stop the server (Ctrl+C)
npm run dev
```

---

## Step 7: Test Google Sign-In

1. **Go to your app:**
   - http://localhost:3000

2. **Click "Sign Up" or "Login"**

3. **Click "Continue with Google"**

4. **Sign in with Google:**
   - Choose your Google account
   - Grant permissions
   - You'll be redirected back to your app

5. **Check MongoDB Atlas:**
   - Go to https://cloud.mongodb.com
   - Browse Collections → `aistackly` database → `users`
   - You should see your Google user!

---

## Production Setup

When deploying to production (e.g., Vercel):

1. **Add Production URL to Google Console:**
   - Go back to Google Cloud Console → Credentials
   - Edit your OAuth client
   - Add authorized origins:
     - `https://yourdomain.com`
   - Add authorized redirect URIs:
     - `https://yourdomain.com/api/auth/callback/google`

2. **Update Environment Variables:**
   ```env
   NEXTAUTH_URL=https://yourdomain.com
   GOOGLE_CLIENT_ID=same-as-development
   GOOGLE_CLIENT_SECRET=same-as-development
   ```

3. **Update OAuth Consent Screen:**
   - Change to "Production" (if ready for public use)
   - Update authorized domains to include your production domain

---

## Troubleshooting

### Error: "redirect_uri_mismatch"
- **Cause:** Redirect URI doesn't match Google Console
- **Fix:** Ensure `http://localhost:3000/api/auth/callback/google` is added to authorized redirect URIs

### Error: "invalid_client"
- **Cause:** Wrong Client ID or Secret
- **Fix:** Double-check credentials in `.env` file

### Error: "Access blocked: This app's request is invalid"
- **Cause:** OAuth consent screen not configured
- **Fix:** Complete OAuth consent screen setup (Step 3)

### Google button doesn't appear
- **Cause:** Missing environment variables
- **Fix:** Ensure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
- **Fix:** Restart dev server after adding credentials

### User not being saved to MongoDB
- **Cause:** MongoDB connection issue
- **Fix:** Check `MONGODB_URI` is correct
- **Fix:** Ensure MongoDB Atlas allows network access

---

## What Happens When User Signs In with Google?

1. User clicks "Continue with Google"
2. Redirected to Google's login page
3. User grants permissions
4. Google redirects back with user info
5. NextAuth checks if user exists in MongoDB
6. If new user → Creates user account in MongoDB
7. If existing user → Updates last login time
8. User is logged in with a session
9. All features (history, analytics, profile) work automatically!

---

## Features

✅ **One-Click Sign-In** - No password required
✅ **Auto Account Creation** - Users created automatically on first login
✅ **Profile Picture** - Google avatar used by default
✅ **Secure** - OAuth 2.0 protocol
✅ **Same Features** - History, analytics, profile all work
✅ **Email & Password Still Works** - Users can choose either method

---

## Summary

After setup, users will see:
- **"Continue with Google"** button in login/signup modal
- **Divider** separating Google login from email/password
- **Profile picture** from Google account in navbar

All user data (history, analytics, favorites) works exactly the same whether they sign up with email or Google!

---

**Need Help?** Check the troubleshooting section or ensure all steps are followed correctly.
