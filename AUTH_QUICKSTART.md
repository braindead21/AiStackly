# Quick Start: Testing Authentication

## Prerequisites

1. **MongoDB Atlas Account** (Required for auth features)
   - Sign up at https://www.mongodb.com/cloud/atlas (free tier available)
   - Create a cluster
   - Create database user with read/write permissions
   - Get connection string

2. **Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Fill in required values

## Step-by-Step Setup

### 1. Generate Auth Secret

**Windows PowerShell:**
```powershell
Add-Type -AssemblyName System.Web
[System.Web.Security.Membership]::GeneratePassword(32,4)
```

**Linux/Mac/Git Bash:**
```bash
openssl rand -base64 32
```

Copy the output.

### 2. Configure Environment

Edit `.env.local`:

```env
# Groq API (get from console.groq.com)
GROQ_API_KEY=your_groq_api_key_here

# NextAuth (paste generated secret)
NEXTAUTH_SECRET=paste_your_generated_secret_here
NEXTAUTH_URL=http://localhost:3000

# MongoDB Atlas (get from MongoDB dashboard)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB=aistackly
```

### 3. Install Dependencies

```powershell
npm install
```

### 4. Start Development Server

```powershell
npm run dev
```

### 5. Test Authentication Flow

#### A. Sign Up
1. Open http://localhost:3000
2. Click **"Sign Up"** in navbar
3. Fill in:
   - Name: Your Name
   - Email: your@email.com
   - Password: password123 (min 6 chars)
4. Click **"Sign Up"**
5. Should auto-login and redirect to homepage
6. Check navbar - should show your avatar with first initial

#### B. Use AI Tool (Auto-Save Test)
1. Click **"Tools"** or go to http://localhost:3000/tools
2. Select any tool (e.g., Instagram Caption Generator)
3. Enter some text and generate
4. Output should appear
5. **Behind the scenes**: Output automatically saved to your history

#### C. View History
1. Click your avatar → **"History"**
2. Should see the output you just generated
3. Try downloading as TXT
4. Try downloading as JSON
5. Try deleting the output

#### D. Check Analytics
1. Click your avatar → **"Analytics"**
2. Should show:
   - Daily streak: 1 day
   - Total requests: 1
   - Most used tools: your tool name
   - Daily breakdown showing today's activity

#### E. View Profile
1. Click your avatar → **"Profile"**
2. Should show:
   - Your name and email
   - Daily streak: 1
   - Saved outputs: 1
   - Favorite tools: 0
   - Token usage stats
   - Member since date
   - Last login timestamp

#### F. Favorites (Optional)
1. Go to Tools page
2. Click star icon on any tool card (if implemented in UI)
3. Or manually test via API:

```powershell
$headers = @{ "Content-Type" = "application/json" }
$body = @{ toolId = "instagram-caption-generator"; toolName = "Instagram Caption Generator" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/favorites" -Method POST -Headers $headers -Body $body
```

#### G. Logout & Login
1. Click your avatar → **"Logout"**
2. Should redirect to homepage
3. Navbar should show "Login" and "Sign Up" buttons
4. Click **"Login"**
5. Enter your email and password
6. Should login successfully
7. History and analytics should persist

#### H. Multi-Device Sync Test
1. Open http://localhost:3000 in a different browser (or incognito)
2. Login with same credentials
3. All your saved data should be available
4. Use a tool in Browser 1
5. Refresh Browser 2 → should see new output in history

#### I. Daily Streak Test
1. Use any tool today → Streak = 1
2. **Tomorrow**: Use any tool → Streak = 2
3. **Skip a day, then use tool** → Streak resets to 1

## Common Issues

### "NEXTAUTH_SECRET is not set"
- Add `NEXTAUTH_SECRET` to `.env.local`
- Restart dev server after adding

### "Failed to connect to MongoDB"
- Check `MONGODB_URI` is correct
- Ensure IP address is whitelisted in MongoDB Atlas
- Verify database user credentials

### "Outputs not saving"
- Check browser console for errors
- Verify you're logged in (check navbar for avatar)
- Check server terminal for error logs

### "Session not persisting"
- Clear browser cookies
- Check `NEXTAUTH_URL` matches your domain
- Restart dev server

## Quick API Tests (PowerShell)

### Test Signup
```powershell
$headers = @{ "Content-Type" = "application/json" }
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/signup" -Method POST -Headers $headers -Body $body
```

### Test Login (NextAuth)
```powershell
# Use browser - navigate to:
# http://localhost:3000/api/auth/signin
```

### Test Get History (after login)
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/history"
```

### Test Get Analytics (after login)
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/analytics?days=7"
```

## Verification Checklist

After testing, verify:

- [ ] Can sign up with new account
- [ ] Auto-login after signup works
- [ ] Can login with existing account
- [ ] Tool outputs auto-save when logged in
- [ ] Can view saved outputs in /history
- [ ] Can download outputs as TXT
- [ ] Can download outputs as JSON
- [ ] Can delete saved outputs
- [ ] Analytics dashboard shows usage data
- [ ] Profile page displays user stats
- [ ] Daily streak increments correctly
- [ ] Can logout successfully
- [ ] Can login from different browser (multi-device sync)
- [ ] Guest users can still use tools without login

## Next Steps

Once verified:

1. **Deploy to Production**
   - Update `NEXTAUTH_URL` to your domain
   - Set production MongoDB URI
   - Deploy to Vercel/Netlify

2. **Monitor Usage**
   - Check MongoDB Atlas for user growth
   - Monitor token consumption
   - Track most-used tools

3. **Iterate**
   - Gather user feedback
   - Add requested features
   - Optimize performance

---

**Need Help?** Check `AUTH_SETUP.md` for comprehensive documentation.
