# Authentication System Guide

## Overview

AI Stackly includes a comprehensive authentication system that provides logged-in users with advanced features including saved history, favorites, analytics, and more.

## Features

### 1. **User Authentication**
- Email/password registration and login
- JWT-based sessions (30-day expiry)
- Secure password hashing with bcryptjs
- Session persistence across devices

### 2. **Saved History**
- Automatically saves all AI tool outputs
- View past inputs and results
- Download outputs as TXT or JSON
- Filter by tool type
- Delete unwanted outputs

### 3. **Favorites**
- Pin your most-used tools for quick access
- Unique favorites per user
- Quick add/remove functionality

### 4. **Analytics Dashboard**
- Daily usage tracking
- Most-used tools statistics
- Token consumption monitoring
- Daily streak counter
- Customizable time periods (7/14/30/90 days)

### 5. **User Profile**
- View account information
- Track daily streak
- Monitor total outputs saved
- See favorite tools count
- Token usage statistics

### 6. **Multi-Device Sync**
- All data synced via MongoDB
- Access your history from any device
- Consistent experience across browsers

### 7. **Download Outputs**
- Export saved outputs as TXT files
- Export as JSON for data portability
- Includes full metadata (timestamps, tokens, etc.)

### 8. **Automatic Output Saving**
- Logged-in users automatically save all tool outputs
- No manual save button required
- Guest users still work normally without saving

## Setup

### 1. Environment Variables

Add to your `.env` file:

```bash
# Authentication Secret (REQUIRED)
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your_secret_here

# NextAuth URL (REQUIRED)
NEXTAUTH_URL=http://localhost:3000

# MongoDB (REQUIRED for auth features)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB=aistackly
```

### 2. Generate Auth Secret

```bash
# On Linux/Mac/Windows Git Bash
openssl rand -base64 32

# On Windows PowerShell
Add-Type -AssemblyName System.Web
[System.Web.Security.Membership]::GeneratePassword(32,4)
```

### 3. MongoDB Setup

1. Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier available)
3. Create a database user with read/write permissions
4. Get your connection string and add it to `.env`

### 4. Install Dependencies

All required packages are already in `package.json`:

```bash
npm install
# or
pnpm install
```

Dependencies include:
- `next-auth`: Authentication library
- `bcryptjs`: Password hashing
- `mongoose`: MongoDB ODM
- `@types/bcryptjs`: TypeScript types

## Usage

### For Users

#### Sign Up
1. Click "Sign Up" in the navbar
2. Enter name, email, and password (min 6 characters)
3. Automatically logged in after registration

#### Login
1. Click "Login" in the navbar
2. Enter email and password
3. Redirected to homepage

#### Using Tools
- All tool outputs automatically saved when logged in
- View saved outputs in History page
- Track usage in Analytics dashboard

#### Viewing History
1. Click your avatar → History
2. Filter by tool type
3. Download outputs as TXT or JSON
4. Delete unwanted outputs

#### Analytics
1. Click your avatar → Analytics
2. View daily streak and usage stats
3. See most-used tools
4. Filter by time period

#### Profile
1. Click your avatar → Profile
2. View account details
3. Track streak and token usage

### For Developers

#### Protect Routes

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/");
  }
  
  // Your protected page code
}
```

#### Get User Session

```typescript
// Server Component
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const session = await getServerSession(authOptions);
const userId = session?.user?.id;

// Client Component
import { useSession } from "next-auth/react";

const { data: session, status } = useSession();
const userId = session?.user?.id;
```

#### Save Tool Output

```typescript
import SavedOutput from "@/models/SavedOutput";
import User from "@/models/User";

// Create saved output
const savedOutput = await SavedOutput.create({
  userId: session.user.id,
  toolId: "instagram-caption-generator",
  toolName: "Instagram Caption Generator",
  input: "User's input text",
  result: "AI-generated result",
  tokensUsed: {
    promptTokens: 100,
    completionTokens: 50,
    totalTokens: 150,
  }
});

// Update user stats
await User.findByIdAndUpdate(session.user.id, {
  $inc: { 
    savedOutputsCount: 1,
    totalTokensUsed: 150 
  }
});
```

#### Track Analytics

```typescript
import UserAnalytics from "@/models/UserAnalytics";

const today = new Date();
today.setHours(0, 0, 0, 0);

const analytics = await UserAnalytics.findOne({
  userId: session.user.id,
  date: today,
});

if (analytics) {
  // Update existing
  const toolIndex = analytics.toolsUsed.findIndex(t => t.toolId === toolId);
  if (toolIndex >= 0) {
    analytics.toolsUsed[toolIndex].count += 1;
  } else {
    analytics.toolsUsed.push({
      toolId,
      toolName,
      count: 1,
      lastUsed: new Date(),
    });
  }
  analytics.totalRequests += 1;
  analytics.totalTokens += tokensUsed;
  await analytics.save();
} else {
  // Create new
  await UserAnalytics.create({
    userId: session.user.id,
    date: today,
    toolsUsed: [{ toolId, toolName, count: 1, lastUsed: new Date() }],
    totalRequests: 1,
    totalTokens: tokensUsed,
  });
}
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login (NextAuth)
- `GET /api/auth/signout` - Logout (NextAuth)
- `GET /api/auth/session` - Get current session (NextAuth)

### History

- `GET /api/history?toolId=<id>&limit=<n>&skip=<n>` - Get saved outputs
- `POST /api/history` - Save new output
- `DELETE /api/history?id=<id>` - Delete output

### Favorites

- `GET /api/favorites` - Get user's favorite tools
- `POST /api/favorites` - Add tool to favorites
- `DELETE /api/favorites?toolId=<id>` - Remove favorite

### Analytics

- `GET /api/analytics?days=<n>` - Get analytics for last N days
- `POST /api/analytics` - Track tool usage

## Database Models

### User

```typescript
{
  name: string;           // User's full name
  email: string;          // Unique email
  password: string;       // Hashed password
  dailyStreak: number;    // Consecutive days active
  lastStreakDate: Date;   // Last streak update
  totalTokensUsed: number;
  savedOutputsCount: number;
  favoriteToolsCount: number;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### SavedOutput

```typescript
{
  userId: ObjectId;       // Reference to User
  toolId: string;         // Tool identifier
  toolName: string;       // Display name
  input: string;          // User's input
  imageUrl?: string;      // Optional image URL
  result: string;         // AI output
  tokensUsed: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### FavoriteTool

```typescript
{
  userId: ObjectId;       // Reference to User
  toolId: string;         // Tool identifier
  toolName: string;       // Display name
  addedAt: Date;          // When favorited
}
```

### UserAnalytics

```typescript
{
  userId: ObjectId;       // Reference to User
  date: Date;             // Day (00:00:00)
  toolsUsed: [{
    toolId: string;
    toolName: string;
    count: number;
    lastUsed: Date;
  }];
  totalRequests: number;  // Total API calls
  totalTokens: number;    // Total tokens consumed
}
```

## Security

- Passwords hashed with bcryptjs (10 salt rounds)
- JWT tokens signed with NEXTAUTH_SECRET
- Sessions expire after 30 days
- CSRF protection via NextAuth
- Database indexes for performance
- Input validation on all endpoints

## Troubleshooting

### "NEXTAUTH_SECRET is not set"
Add `NEXTAUTH_SECRET` to your `.env` file. Generate with `openssl rand -base64 32`.

### "Failed to connect to MongoDB"
- Check your `MONGODB_URI` connection string
- Ensure network access is allowed in MongoDB Atlas
- Verify database user credentials

### "Session not persisting"
- Clear browser cookies and try again
- Verify `NEXTAUTH_URL` matches your domain
- Check browser console for errors

### "Outputs not saving"
- Ensure user is logged in (check session)
- Verify MongoDB connection is working
- Check server logs for save errors

## Best Practices

1. **Always check session** before accessing protected routes
2. **Use optimistic UI updates** for better UX (update UI before API response)
3. **Handle errors gracefully** - auth can fail for many reasons
4. **Log important events** for debugging (user registration, login failures, etc.)
5. **Keep sensitive data secure** - never expose NEXTAUTH_SECRET or passwords
6. **Monitor token usage** - implement rate limiting if needed
7. **Regular backups** of MongoDB data

## Next Steps

- Implement email verification
- Add password reset functionality
- Social login (Google, GitHub, etc.)
- Admin dashboard for user management
- Rate limiting per user
- Export all user data (GDPR compliance)
- Two-factor authentication (2FA)
