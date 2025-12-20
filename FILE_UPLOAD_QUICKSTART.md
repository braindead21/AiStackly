# File Upload Quick Start Guide

## For End Users

### How to Upload Files

1. **Navigate to any tool** (e.g., Instagram Caption Generator, Resume Analyzer)

2. **Upload your file:**
   - **Option A:** Drag and drop your file into the upload zone
   - **Option B:** Click "browse" to select a file from your computer

3. **Add instructions (optional):**
   - Type any additional context or instructions in the text area
   - For example: "Make it professional" or "Focus on technical skills"

4. **Click the tool button** to process your file

5. **View results:**
   - AI will analyze your file and generate results
   - Copy the output or save it to your history (if logged in)

### Supported Files by Tool

| Tool | Upload Images | Upload Documents | Upload Text Files |
|------|---------------|------------------|-------------------|
| Instagram Caption Generator | ✅ Photos | ❌ | ❌ |
| YouTube Title Generator | ✅ Thumbnails | ✅ Scripts | ✅ Notes |
| AI Image Describer | ✅ Any Image | ❌ | ❌ |
| Code Explainer | ✅ Screenshots | ✅ PDFs | ✅ Code Files |
| Resume Analyzer | ✅ Screenshots | ✅ Resume PDFs | ✅ Text Resumes |
| Product Description | ✅ Products | ✅ Specs | ✅ Features |
| And more... | | | |

## For Developers

### File Upload Flow

```
1. User selects file
   ↓
2. Client-side validation (type, size)
   ↓
3. File processing (base64/text extraction)
   ↓
4. Send to API with input text
   ↓
5. API selects appropriate model
   ↓
6. Return results + save to history
```

### Key Files

- **`components/ToolForm.tsx`** - File upload UI component
- **`lib/file-processor.ts`** - File processing utilities
- **`app/api/tools/[tool]/route.ts`** - API handler
- **`config/tools.ts`** - Tool configurations with file support flags

### Adding File Support to New Tools

1. **Update tool config:**
```typescript
{
  id: "my-new-tool",
  title: "My New Tool",
  // ... other config
  acceptsFiles: {
    images: true,    // Allow image uploads
    documents: true, // Allow PDF/Word uploads
    text: true      // Allow text file uploads
  }
}
```

2. **No other changes needed!** ToolForm automatically shows file upload UI for all tools.

### File Processing API

```typescript
// lib/file-processor.ts
import { processFile, validateFile } from '@/lib/file-processor';

// Validate file
const validation = validateFile(file);
if (!validation.valid) {
  alert(validation.error);
  return;
}

// Process file
const processed = await processFile(file);
// Returns: { type, content, base64?, filename, size, mimeType }
```

### API Request Format

```typescript
// For images
{
  input: "Generate a caption for this image",
  imageUrl: "data:image/jpeg;base64,...",
  fileName: "photo.jpg"
}

// For documents/text
{
  input: "User instructions + file content",
  fileName: "resume.pdf",
  fileType: "document"
}
```

## Examples

### Example 1: Instagram Caption from Photo

1. Open Instagram Caption Generator
2. Drag your photo onto the upload zone
3. (Optional) Type: "Make it fun and engaging"
4. Click "Generate Caption"
5. AI analyzes the image and creates relevant captions

### Example 2: Resume Analysis

1. Open Resume Analyzer
2. Click "browse" and select your resume PDF
3. (Optional) Type: "Focus on tech industry"
4. Click "Analyze Resume"
5. Get ATS compatibility feedback and suggestions

### Example 3: Code Explanation

1. Open Code Explainer
2. Upload your .js or .py file
3. (Optional) Type: "Explain the algorithm"
4. Click "Explain Code"
5. Receive detailed code explanation

## Tips & Tricks

### Best Practices

✅ **DO:**
- Use high-quality, clear images
- Keep files under 10MB
- Name files descriptively
- Add context in the text field
- Use appropriate file formats

❌ **DON'T:**
- Upload corrupted files
- Use extremely large files (over 10MB)
- Upload unsupported formats
- Expect text extraction from scanned PDFs (use OCR first)

### Pro Tips

1. **Combine inputs:** Upload a file AND add text instructions for best results
2. **File naming:** Descriptive filenames help you track saved outputs
3. **Image quality:** Higher quality = better AI analysis
4. **Text files:** Plain text works better than formatted documents
5. **Code files:** Use proper file extensions (.js, .py, etc.)

## Troubleshooting

### Common Issues

**"Unsupported file type"**
- Check that your file is in a supported format
- Try converting to JPG (images) or TXT (documents)

**"File too large"**
- Compress your image (use online tools)
- Split large documents into smaller sections

**"No text extracted from PDF"**
- Try copying text manually from the PDF
- Ensure PDF is text-based, not scanned images

**Image not processing**
- Verify image format (JPG, PNG)
- Check if image is corrupted
- Try a different image

**Slow processing**
- Large files take longer
- Vision models slower than text models
- Be patient, usually < 5 seconds

## Security & Privacy

- ✅ Files processed in-memory only
- ✅ No permanent server storage
- ✅ Client-side file conversion
- ✅ Only metadata saved (name, size, type)
- ✅ Secure JWT authentication
- ✅ HTTPS encryption

## Need Help?

- 📖 Read [FILE_UPLOAD_FEATURE.md](./FILE_UPLOAD_FEATURE.md) for detailed documentation
- 🔧 Check tool-specific file support in the table above
- 💡 Experiment with different file types and tools
- 📝 Combine file uploads with text instructions for best results

---

**Enjoy the new file upload feature! 🎉**
