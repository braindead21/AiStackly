# Quick Start Guide - AI Stackly

Get your AI tools platform running in 5 minutes!

## 🚀 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Get Groq API Key (Free)
1. Visit [console.groq.com](https://console.groq.com)
2. Sign up (it's free!)
3. Go to **API Keys** section
4. Click **Create API Key**
5. Copy your key

### 3. Set Up Environment
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local and add your key:
GROQ_API_KEY=your_actual_key_here
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Open Your Browser
Navigate to: **http://localhost:3000**

---

## ✅ You're Done!

You now have access to **15 AI tools**:

### Try These First:

1. **SEO Meta Description Generator**
   - Visit: http://localhost:3000/tools/seo-meta-description-generator
   - Enter: "Ultimate Guide to Next.js"
   - Get optimized meta description!

2. **Grammar Corrector**
   - Visit: http://localhost:3000/tools/grammar-corrector
   - Enter text with errors
   - Get corrections with explanations!

3. **Text Summarizer**
   - Visit: http://localhost:3000/tools/text-summarizer
   - Paste a long article
   - Get key points instantly!

---

## 🧪 Test with PowerShell

```powershell
# Test the grammar corrector
Invoke-RestMethod -Uri 'http://localhost:3000/api/tools/grammar-corrector' -Method POST -Body (@{
    input = 'I has went to the store yesterday and buy some grocerys'
} | ConvertTo-Json) -ContentType 'application/json'
```

You should see:
```json
{
  "success": true,
  "result": "Corrected Text: 'I went to the store yesterday and bought some groceries.'...",
  "usage": {
    "promptTokens": 45,
    "completionTokens": 67,
    "totalTokens": 112
  }
}
```

---

## 📱 View All Tools

Visit: **http://localhost:3000/tools**

You'll see all 15 tools organized by category:
- Social Media (4 tools)
- SEO & Marketing (1 tool)
- Content Writing (1 tool)
- E-commerce (1 tool)
- And 5+ more categories!

---

## 🎨 Features Available

✅ Dark mode (auto-detects system preference)  
✅ Responsive design (mobile, tablet, desktop)  
✅ Loading states with spinners  
✅ Error handling  
✅ Success feedback  
✅ Token usage tracking  
✅ No sign-up required  
✅ Completely free  

---

## 📊 Optional: Add MongoDB

By default, the Items CRUD uses **in-memory storage** (data clears on restart).

To persist data, add MongoDB:

```env
# Add to .env.local
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/
MONGODB_DB=aistackly
```

Get free MongoDB at: [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

---

## 🆘 Common Issues

### "AI service not configured"
- Check your `.env.local` file exists
- Verify `GROQ_API_KEY` is set correctly
- Restart dev server: `Ctrl+C` then `npm run dev`

### "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 already in use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

---

## 📚 Next Steps

1. **Explore all tools** at `/tools`
2. **Read API docs** in `README.md`
3. **Test with PowerShell** using `TESTING.md`
4. **Deploy to Vercel** (see README.md)

---

## 🎉 Enjoy!

You now have a production-ready AI tools platform with:
- 15 AI tools
- Dark mode
- Responsive design
- Free forever (Groq free tier)
- No sign-up required

**Happy building!** 🚀
