# AI Tools Testing Guide

This document provides PowerShell test commands for all AI tools.

## Prerequisites
- Development server running: `npm run dev`
- Groq API key configured in `.env.local`
- Server URL: `http://localhost:3000`

---

## 1. SEO Meta Description Generator

**Tool ID:** `seo-meta-description-generator`

### PowerShell Test:
```powershell
Invoke-RestMethod -Uri 'http://localhost:3000/api/tools/seo-meta-description-generator' -Method POST -Body (@{
    input = 'Ultimate Guide to Next.js 14: Build Modern Web Applications with Server Components and App Router'
} | ConvertTo-Json) -ContentType 'application/json'
```

### Expected Response:
```json
{
  "success": true,
  "result": "Learn Next.js 14 with our comprehensive guide covering server components, app router, and modern web development. Build fast, SEO-optimized applications today.",
  "usage": {
    "promptTokens": 45,
    "completionTokens": 38,
    "totalTokens": 83
  }
}
```

---

## 2. Article Outliner

**Tool ID:** `article-outliner`

### PowerShell Test:
```powershell
Invoke-RestMethod -Uri 'http://localhost:3000/api/tools/article-outliner' -Method POST -Body (@{
    input = 'How to Build a Successful SaaS Product in 2025'
} | ConvertTo-Json) -ContentType 'application/json'
```

### Expected Response:
```json
{
  "success": true,
  "result": "I. Introduction\n  A. The SaaS Market in 2025\n  B. Why Now is the Perfect Time\n\nII. Ideation and Validation\n  A. Finding Your Niche\n  B. Market Research\n  C. MVP Definition\n\nIII. Technical Implementation...",
  "usage": {
    "promptTokens": 52,
    "completionTokens": 245,
    "totalTokens": 297
  }
}
```

---

## 3. Product Description Generator

**Tool ID:** `product-description-generator`

### PowerShell Test:
```powershell
Invoke-RestMethod -Uri 'http://localhost:3000/api/tools/product-description-generator' -Method POST -Body (@{
    input = 'Wireless Noise-Cancelling Headphones - 30 hour battery, premium sound quality, comfortable over-ear design'
} | ConvertTo-Json) -ContentType 'application/json'
```

### Expected Response:
```json
{
  "success": true,
  "result": "Experience audio perfection with our premium wireless noise-cancelling headphones...",
  "usage": {
    "promptTokens": 68,
    "completionTokens": 156,
    "totalTokens": 224
  }
}
```

---

## 4. LinkedIn Post Generator

**Tool ID:** `linkedin-post-generator`

### PowerShell Test:
```powershell
Invoke-RestMethod -Uri 'http://localhost:3000/api/tools/linkedin-post-generator' -Method POST -Body (@{
    input = 'The importance of AI skills for software developers in 2025'
} | ConvertTo-Json) -ContentType 'application/json'
```

### Expected Response:
```json
{
  "success": true,
  "result": "🚀 AI is no longer optional for developers—it's essential.\n\nHere's what I've learned after 6 months of integrating AI into my workflow...",
  "usage": {
    "promptTokens": 61,
    "completionTokens": 198,
    "totalTokens": 259
  }
}
```

---

## 5. Facebook Ads Copy Generator

**Tool ID:** `facebook-ads-copy-generator`

### PowerShell Test:
```powershell
Invoke-RestMethod -Uri 'http://localhost:3000/api/tools/facebook-ads-copy-generator' -Method POST -Body (@{
    input = 'Online coding bootcamp for beginners - 12 weeks, job guarantee, payment plans available. Target audience: career changers aged 25-35'
} | ConvertTo-Json) -ContentType 'application/json'
```

### Expected Response:
```json
{
  "success": true,
  "result": "Variation 1:\nReady to change your career? 🚀\n...\n\nVariation 2:\nTired of your 9-5? Learn to code in just 12 weeks...\n\nVariation 3:\n...",
  "usage": {
    "promptTokens": 89,
    "completionTokens": 267,
    "totalTokens": 356
  }
}
```

---

## 6. Resume Analyzer

**Tool ID:** `resume-analyzer`

### PowerShell Test:
```powershell
$resumeText = @"
John Doe
Software Engineer
Experience:
- Developed web applications using React and Node.js
- Worked on team projects
Education:
- B.S. Computer Science, State University
"@

Invoke-RestMethod -Uri 'http://localhost:3000/api/tools/resume-analyzer' -Method POST -Body (@{
    input = $resumeText
} | ConvertTo-Json) -ContentType 'application/json'
```

### Expected Response:
```json
{
  "success": true,
  "result": "ATS Compatibility Analysis:\n✅ STRENGTHS:\n- Clean, simple formatting...\n\n⚠️ AREAS FOR IMPROVEMENT:\n1. Missing quantifiable achievements...",
  "usage": {
    "promptTokens": 127,
    "completionTokens": 312,
    "totalTokens": 439
  }
}
```

---

## 7. Text Summarizer

**Tool ID:** `text-summarizer`

### PowerShell Test:
```powershell
$longText = @"
Artificial intelligence has transformed the technology landscape over the past decade. Machine learning algorithms now power everything from recommendation systems to autonomous vehicles. Deep learning, a subset of machine learning, has achieved remarkable success in areas like computer vision and natural language processing. The availability of large datasets and powerful computing resources has accelerated AI research and development. However, concerns about AI safety, bias, and ethical implications continue to be important topics of discussion in the field.
"@

Invoke-RestMethod -Uri 'http://localhost:3000/api/tools/text-summarizer' -Method POST -Body (@{
    input = $longText
} | ConvertTo-Json) -ContentType 'application/json'
```

### Expected Response:
```json
{
  "success": true,
  "result": "Key Points:\n• AI has revolutionized technology in the last 10 years\n• ML algorithms power recommendations and autonomous vehicles\n• Deep learning excels in vision and NLP\n• Big data and computing drove AI advancement\n• AI safety and ethics remain critical concerns",
  "usage": {
    "promptTokens": 142,
    "completionTokens": 89,
    "totalTokens": 231
  }
}
```

---

## 8. Email Rewriter

**Tool ID:** `email-rewriter`

### PowerShell Test (Formal Tone):
```powershell
Invoke-RestMethod -Uri 'http://localhost:3000/api/tools/email-rewriter' -Method POST -Body (@{
    input = 'Hey! Just wanted to check if you got my last email about the project deadline. Let me know ASAP! Thanks'
} | ConvertTo-Json) -ContentType 'application/json'
```

**Note:** For tone selection, you can modify the prompt in the config to include `{{tone}}` placeholder and pass it as a parameter, or simply mention the desired tone in the input.

### Expected Response:
```json
{
  "success": true,
  "result": "Dear [Recipient],\n\nI hope this message finds you well. I am writing to follow up on my previous email regarding the project deadline...",
  "usage": {
    "promptTokens": 78,
    "completionTokens": 124,
    "totalTokens": 202
  }
}
```

---

## 9. Grammar Corrector

**Tool ID:** `grammar-corrector`

### PowerShell Test:
```powershell
Invoke-RestMethod -Uri 'http://localhost:3000/api/tools/grammar-corrector' -Method POST -Body (@{
    input = 'Their going to the store tommorow to by some grocerys. Me and him has been working on this project for three week.'
} | ConvertTo-Json) -ContentType 'application/json'
```

### Expected Response:
```json
{
  "success": true,
  "result": "Corrected Text:\n'They're going to the store tomorrow to buy some groceries. He and I have been working on this project for three weeks.'\n\nMajor Corrections:\n1. 'Their' → 'They're' (incorrect homophone)\n2. 'tommorow' → 'tomorrow' (spelling)\n3. 'by' → 'buy' (incorrect homophone)...",
  "usage": {
    "promptTokens": 95,
    "completionTokens": 167,
    "totalTokens": 262
  }
}
```

---

## 10. Cold Email Generator

**Tool ID:** `cold-email-generator`

### PowerShell Test:
```powershell
Invoke-RestMethod -Uri 'http://localhost:3000/api/tools/cold-email-generator' -Method POST -Body (@{
    input = 'Recipient: Marketing Director at TechCorp. Purpose: Introduce our AI content writing platform. Offer: Free 30-day trial, can increase content output by 5x'
} | ConvertTo-Json) -ContentType 'application/json'
```

### Expected Response:
```json
{
  "success": true,
  "result": "Subject: 5x More Content Without Hiring More Writers\n\nHi [Name],\n\nI noticed TechCorp recently expanded your content marketing efforts...\n\nBest regards,\n[Your Name]",
  "usage": {
    "promptTokens": 102,
    "completionTokens": 234,
    "totalTokens": 336
  }
}
```

---

## 11. Plagiarism Checker

**Tool ID:** `plagiarism-checker`

### PowerShell Test:
```powershell
Invoke-RestMethod -Uri 'http://localhost:3000/api/tools/plagiarism-checker' -Method POST -Body (@{
    input = 'In today''s fast-paced digital world, businesses need to leverage cutting-edge solutions to stay ahead of the curve and think outside the box. At the end of the day, it''s all about delivering value-added services.'
} | ConvertTo-Json) -ContentType 'application/json'
```

### Expected Response:
```json
{
  "success": true,
  "result": "Originality Assessment: 3/10 (Low Originality)\n\nIssues Identified:\n• Clichés detected: 'fast-paced digital world', 'cutting-edge', 'stay ahead of the curve', 'think outside the box', 'at the end of the day', 'value-added'\n• Generic business jargon overuse\n• Lacks unique voice or perspective...",
  "usage": {
    "promptTokens": 118,
    "completionTokens": 178,
    "totalTokens": 296
  }
}
```

---

## Common Error Responses

### Missing Input:
```json
{
  "success": false,
  "error": "Input is required"
}
```

### Missing API Key:
```json
{
  "success": false,
  "error": "AI service not configured. Please set GROQ_API_KEY."
}
```

### Invalid Tool ID:
```json
{
  "success": false,
  "error": "Invalid tool ID"
}
```

---

## Testing All Tools (Batch Script)

Save as `test-all-tools.ps1`:

```powershell
$tools = @(
    @{ id = "seo-meta-description-generator"; input = "Best AI Tools 2025" },
    @{ id = "article-outliner"; input = "Future of Remote Work" },
    @{ id = "product-description-generator"; input = "Smart Watch - fitness tracking, notifications, 7 day battery" },
    @{ id = "linkedin-post-generator"; input = "Tips for growing on LinkedIn" },
    @{ id = "facebook-ads-copy-generator"; input = "Fitness app with personalized workouts" },
    @{ id = "text-summarizer"; input = "Long article text here..." },
    @{ id = "grammar-corrector"; input = "I has went to the store yesterday" },
    @{ id = "cold-email-generator"; input = "SaaS product demo for sales managers" }
)

foreach ($tool in $tools) {
    Write-Host "`n=== Testing $($tool.id) ===" -ForegroundColor Cyan
    try {
        $result = Invoke-RestMethod -Uri "http://localhost:3000/api/tools/$($tool.id)" -Method POST -Body (@{
            input = $tool.input
        } | ConvertTo-Json) -ContentType 'application/json'
        
        Write-Host "✓ Success" -ForegroundColor Green
        Write-Host "Tokens: $($result.usage.totalTokens)" -ForegroundColor Yellow
    }
    catch {
        Write-Host "✗ Error: $_" -ForegroundColor Red
    }
    Start-Sleep -Seconds 2
}
```

Run with: `.\test-all-tools.ps1`

---

## Notes

- All tools use the same backend API route (`/api/tools/[tool]/route.ts`)
- Rate limits: 30 requests/min, 6K tokens/min on free tier
- Vision model only used for `ai-image-describer` tool
- All other tools use `llama-3.1-8b-instant` text model
- Responses always follow format: `{ success, result, usage, error }`
