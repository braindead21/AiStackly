# File Upload Feature Documentation

## Overview

All AI Stackly tools now support file uploads! Users can upload images, documents, and text files directly, making the tools more versatile and user-friendly.

## Supported File Types

### Images (Up to 10MB)
- JPEG/JPG
- PNG
- GIF
- WebP
- BMP

**Best for:** Instagram Caption Generator, AI Image Describer, Product Description Generator, YouTube Title Generator

### Documents (Up to 10MB)
- PDF
- Microsoft Word (.doc, .docx)

**Best for:** Resume Analyzer, Text Summarizer, Article Outliner, SEO Meta Description Generator

### Text Files (Up to 10MB)
- Plain text (.txt)
- CSV (.csv)
- Markdown (.md)
- HTML (.html)
- Code files (.js, .ts, .py, .java, .json)

**Best for:** Code Explainer, Grammar Corrector, Plagiarism Checker, Email Rewriter

## How It Works

### For Users

1. **Upload a File:**
   - Drag and drop a file into the upload zone
   - OR click "browse" to select a file from your computer

2. **Add Context (Optional):**
   - After uploading, you can add additional instructions in the text area
   - This helps the AI understand exactly what you want

3. **Get Results:**
   - Click the tool's button to process
   - The AI will analyze your file and provide results

### For Images
- Images are converted to base64 format
- Sent to Groq's vision model (llama-4-scout-17b-16e-instruct)
- Perfect for generating captions, descriptions, or analyzing visual content

### For Documents & Text Files
- Text content is extracted from the file
- Combined with any additional instructions you provide
- Processed by the text model (llama-3.1-8b-instant)

## Tool-Specific File Support

| Tool | Images | Documents | Text Files |
|------|---------|-----------|------------|
| Instagram Caption Generator | ✅ | ❌ | ❌ |
| YouTube Title Generator | ✅ | ✅ | ✅ |
| AI Image Describer | ✅ | ❌ | ❌ |
| Code Explainer | ✅ | ✅ | ✅ |
| SEO Meta Description Generator | ❌ | ✅ | ✅ |
| Article Outliner | ❌ | ✅ | ✅ |
| Product Description Generator | ✅ | ✅ | ✅ |
| LinkedIn Post Generator | ✅ | ✅ | ✅ |
| Facebook Ads Copy Generator | ✅ | ✅ | ✅ |
| Resume Analyzer | ✅ | ✅ | ✅ |
| Text Summarizer | ❌ | ✅ | ✅ |
| Email Rewriter | ❌ | ✅ | ✅ |
| Grammar Corrector | ✅ | ✅ | ✅ |
| Cold Email Generator | ❌ | ✅ | ✅ |
| Plagiarism Checker | ❌ | ✅ | ✅ |

## Features

### Drag & Drop Interface
- Modern, intuitive file upload experience
- Visual feedback when dragging files
- No need to click - just drop!

### File Preview
- Images show thumbnail previews
- Documents show file icon
- File size and type displayed

### Validation
- Automatic file type checking
- Size limit enforcement (10MB max)
- Clear error messages

### Flexibility
- Use files alone
- Use text input alone
- Combine files with additional instructions

## Technical Implementation

### Frontend (`components/ToolForm.tsx`)
- File selection via input or drag-and-drop
- File validation before upload
- Base64 conversion for images
- Text extraction for documents
- File preview rendering

### File Processing (`lib/file-processor.ts`)
- `processFile()` - Main processing function
- `validateFile()` - Validation checks
- `fileToBase64()` - Image conversion
- `readFileAsText()` - Text extraction
- `formatFileSize()` - Human-readable sizes

### Backend (`app/api/tools/[tool]/route.ts`)
- Accepts `imageUrl`, `fileName`, `fileType` parameters
- Automatically uses vision model for images
- Combines file content with user input
- Saves file metadata in history

### Database (`models/SavedOutput.ts`)
- New `fileName` field added
- Stores uploaded file names in history
- Helps users track which files they've processed

## Example Use Cases

### 1. Instagram Caption Generator
**Before:** Type description of your photo
**Now:** Upload the photo directly! The AI will see your image and generate relevant captions.

### 2. Resume Analyzer
**Before:** Copy-paste resume text
**Now:** Upload your resume PDF or Word doc directly for analysis.

### 3. Code Explainer
**Before:** Copy-paste code from your editor
**Now:** Upload your .js, .py, or .ts file directly!

### 4. Grammar Corrector
**Before:** Copy-paste your document
**Now:** Upload your text file, Word doc, or even a screenshot of text!

### 5. Product Description Generator
**Before:** Describe your product in words
**Now:** Upload product images and let AI see what you're selling!

## Best Practices

### For Best Results:
1. **Use High-Quality Images** - Clear, well-lit photos work best
2. **Keep Files Organized** - Name files descriptively before uploading
3. **Add Context** - Even with files, additional instructions help
4. **Check File Size** - Stay under 10MB for best performance
5. **Use Appropriate Tools** - Match your file type to the tool's capabilities

### Common Workflows:

**Social Media Content:**
1. Upload image → Instagram Caption Generator
2. Add any specific hashtags or themes
3. Generate and customize

**Document Analysis:**
1. Upload resume PDF → Resume Analyzer
2. Get ATS compatibility feedback
3. Make improvements

**Code Review:**
1. Upload code file → Code Explainer
2. Specify what aspects to focus on
3. Learn and improve

## Limitations & Notes

### Current Limitations:
- **PDF Text Extraction:** Basic extraction only. For best results with PDFs, copy-paste text directly.
- **Word Documents:** Prompts users to copy-paste content for better accuracy.
- **File Size:** Maximum 10MB per file.
- **One File at a Time:** Upload one file per request.

### Future Enhancements:
- Advanced PDF parsing
- Multiple file uploads
- File format conversions
- Audio/video file support
- Batch processing

## Troubleshooting

### "Unsupported file type" Error
**Solution:** Make sure your file is in a supported format (see list above).

### "File too large" Error
**Solution:** Compress your file or ensure it's under 10MB.

### Image Not Processing
**Solution:** Convert images to JPG or PNG format. Ensure image is not corrupted.

### Document Text Not Extracted
**Solution:** For PDFs and Word docs, try copying the text and pasting it directly for better results.

## Security

- Files are processed in-memory only
- No files are permanently stored on servers
- Base64 conversion happens client-side
- Only file metadata saved in database (name, size, type)
- All uploads validated for type and size

## Performance

- **Image Upload:** ~1-2 seconds processing
- **Document Upload:** ~1-3 seconds processing
- **Text Files:** Near instant processing
- **Vision Model:** Slightly slower than text model but highly accurate

## Conclusion

The file upload feature makes AI Stackly tools significantly more powerful and user-friendly. Users can now work directly with their files instead of copying and pasting content, saving time and improving accuracy.

This feature enhances all 15 tools and provides a foundation for future enhancements like batch processing, advanced document parsing, and multimedia support.
