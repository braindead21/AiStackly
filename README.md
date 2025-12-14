# AI Stackly - AI-Powered Content & Productivity Tools

A modern Next.js application featuring 15+ free AI tools powered by Groq's ultra-fast language models.

## 🚀 Features

### User Authentication System
- **User Registration & Login** - Email/password authentication with JWT
- **Saved History** - Automatically save all AI tool outputs
- **Favorites** - Pin your most-used tools for quick access
- **Analytics Dashboard** - Track usage, streaks, and token consumption
- **User Profile** - View stats, streak count, and account info
- **Multi-Device Sync** - Access your data from any device
- **Download Outputs** - Export saved results as TXT or JSON
- **Daily Streak Tracking** - Gamified engagement with consecutive day tracking

📖 **[Full Authentication Guide](./AUTH_SETUP.md)**

### AI Tools Collection (15 Tools Across 9 Categories)

#### Social Media & Marketing
- **Instagram Caption Generator** - Create engaging Instagram captions
- **YouTube Title Generator** - Generate high-CTR video titles
- **LinkedIn Post Generator** - Professional posts for thought leadership
- **Facebook Ads Copy Generator** - Multiple ad variations for campaigns

#### SEO & Content
- **SEO Meta Description Generator** - Optimized meta descriptions (150-160 chars)
- **Article Outliner** - Structured outlines for long-form content
- **Text Summarizer** - Condense long articles into key points

#### E-commerce & Sales
- **Product Description Generator** - Persuasive product copy
- **Cold Email Generator** - Personalized sales outreach emails

#### Writing & Communication
- **Grammar Corrector** - Fix grammar, spelling, and style issues
- **Email Rewriter** - Transform tone (formal, casual, persuasive)
- **Plagiarism Checker** - Originality assessment and cliché detection

#### Career Tools
- **Resume Analyzer** - ATS compatibility and optimization tips

#### Development
- **Code Explainer** - Detailed code explanations

#### AI Vision
- **AI Image Describer** - Analyze and describe images using vision models

### Additional Features
- **Items CRUD System** - Full MongoDB-backed REST API with frontend UI
- **Dark Mode Support** - System-aware theme switching
- **Responsive Design** - Mobile-first Tailwind CSS implementation
- **Toast Notifications** - User feedback system
- **Category Organization** - Tools grouped by use case

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI:** React 19
- **Authentication:** NextAuth.js (JWT strategy)
- **Database:** MongoDB (Mongoose) with in-memory fallback
- **AI:** Groq API
  - Text Model: `llama-3.1-8b-instant`
  - Vision Model: `meta-llama/llama-4-scout-17b-16e-instruct`
- **Security:** bcryptjs for password hashing
- **Deployment Ready:** Vercel-optimized

## 📦 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account (optional - has in-memory fallback)
- Groq API key (free tier available)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd aistackly

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create `.env.local`:

```env
# Required for AI tools
GROQ_API_KEY=your_groq_api_key_here

# Required for authentication
NEXTAUTH_SECRET=your_secret_here  # Generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# Required for auth features (MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB=aistackly
```

### Generate Auth Secret

```bash
# On Linux/Mac/Windows Git Bash
openssl rand -base64 32

# On Windows PowerShell
Add-Type -AssemblyName System.Web
[System.Web.Security.Membership]::GeneratePassword(32,4)
```

### Get Your Groq API Key

1. Visit [console.groq.com](https://console.groq.com)
2. Sign up for free account
3. Navigate to API Keys
4. Create new API key
5. Copy to `.env.local`

**Free Tier Limits:**
- 30 requests/minute
- 14,400 requests/day
- 6,000 tokens/minute
- No cost - completely free!

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📚 Project Structure

```
aistackly/
├── app/
│   ├── api/
│   │   ├── items/          # CRUD API routes
│   │   └── tools/[tool]/   # AI tools API endpoint
│   ├── items/              # Items CRUD UI
│   ├── tools/              # AI tools pages
│   │   ├── page.tsx        # Tools listing
│   │   └── [tool]/         # Individual tool pages
│   ├── layout.tsx
│   ├── page.tsx            # Landing page
│   └── globals.css
├── components/
│   ├── items/              # CRUD components
│   ├── layout/             # Layout components
│   ├── tools/              # Tool components
│   └── ui/                 # Reusable UI
├── config/
│   └── tools.ts            # Tool configurations
├── lib/
│   ├── api/                # Frontend API clients
│   ├── db.ts               # MongoDB connection
│   └── groq.ts             # Groq AI client
├── models/
│   └── Item.ts             # Mongoose schemas
└── styles/
    ├── theme.css           # Design tokens
    └── utilities.css       # Tailwind utilities
```

## 🔌 API Documentation

### AI Tools API

All AI tools share a unified API endpoint: `/api/tools/[tool-id]`

**Endpoint:** `POST /api/tools/{tool-id}`

**Request Format:**
```json
{
  "input": "Your text input here",
  "imageUrl": "https://example.com/image.jpg" // Optional, only for vision tools
}
```

**Response Format:**
```json
{
  "success": true,
  "result": "AI-generated output",
  "usage": {
    "promptTokens": 45,
    "completionTokens": 120,
    "totalTokens": 165
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

### Example: SEO Meta Description Generator

**PowerShell:**
```powershell
Invoke-RestMethod -Uri 'http://localhost:3000/api/tools/seo-meta-description-generator' -Method POST -Body (@{
    input = 'Ultimate Guide to Next.js 14: Build Modern Web Applications'
} | ConvertTo-Json) -ContentType 'application/json'
```

**cURL:**
```bash
curl -X POST http://localhost:3000/api/tools/seo-meta-description-generator \
  -H "Content-Type: application/json" \
  -d '{"input":"Ultimate Guide to Next.js 14: Build Modern Web Applications"}'
```

**JavaScript/TypeScript:**
```typescript
const response = await fetch('/api/tools/seo-meta-description-generator', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    input: 'Ultimate Guide to Next.js 14: Build Modern Web Applications'
  })
});

const data = await response.json();
console.log(data.result);
```

### Available Tool IDs

| Tool ID | Description | Model Type |
|---------|-------------|------------|
| `instagram-caption-generator` | Generate Instagram captions | Text |
| `youtube-title-generator` | Generate YouTube titles | Text |
| `seo-meta-description-generator` | SEO meta descriptions | Text |
| `article-outliner` | Article structure outlines | Text |
| `product-description-generator` | Product copy | Text |
| `linkedin-post-generator` | LinkedIn posts | Text |
| `facebook-ads-copy-generator` | Facebook ad variations | Text |
| `resume-analyzer` | ATS compatibility check | Text |
| `text-summarizer` | Summarize long content | Text |
| `email-rewriter` | Change email tone | Text |
| `grammar-corrector` | Fix grammar/spelling | Text |
| `cold-email-generator` | Sales outreach emails | Text |
| `plagiarism-checker` | Originality assessment | Text |
| `code-explainer` | Explain code snippets | Text |
| `ai-image-describer` | Analyze images | Vision |

See [TESTING.md](./TESTING.md) for comprehensive testing examples.

---

## 📊 Items CRUD API

### Endpoints

**GET /api/items** - List all items
```powershell
Invoke-RestMethod -Uri 'http://localhost:3000/api/items' -Method GET
```

**POST /api/items** - Create item
```powershell
$body = @{ name = "Test"; description = "Demo" } | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:3000/api/items' -Method POST -Body $body -ContentType 'application/json'
```

**GET /api/items/[id]** - Get single item
```powershell
Invoke-RestMethod -Uri 'http://localhost:3000/api/items/123' -Method GET
```

**PUT /api/items/[id]** - Update item
```powershell
$body = @{ name = "Updated"; description = "New desc" } | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:3000/api/items/123' -Method PUT -Body $body -ContentType 'application/json'
```

**DELETE /api/items/[id]** - Delete item
```powershell
Invoke-RestMethod -Uri 'http://localhost:3000/api/items/123' -Method DELETE
```

### Response Format

**Success:**
```json
{
  "success": true,
  "items": [...] // or "item": {...}
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## 🎨 Frontend Components

### Using AI Tools in Your Code

```typescript
import { callTool } from '@/lib/api/tools';

const result = await callTool('seo-meta-description-generator', {
  input: 'Your content here'
});

if (result.success) {
  console.log(result.result);
  console.log(`Used ${result.usage?.totalTokens} tokens`);
}
```

### Using Items CRUD

```typescript
import { getAllItems, createItem } from '@/lib/api/items';

// Get all items
const items = await getAllItems();

// Create new item
const newItem = await createItem({
  name: 'New Item',
  description: 'Description'
});
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables:
   - `GROQ_API_KEY`
   - `MONGODB_URI` (optional)
4. Deploy!

### Environment Variables for Production

```env
GROQ_API_KEY=your_production_key
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
MONGODB_DB=aistackly
```

---

## 📝 License

MIT License - feel free to use this project for your own purposes.

---

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

---

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ using Next.js, Tailwind CSS, and Groq AI**
