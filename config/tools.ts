export type ToolConfig = {
  id: string;
  title: string;
  description: string;
  prompt: string;
  placeholder: string;
  buttonText: string;
  category?: string;
  modelType?: "text" | "vision";
};

export const tools: ToolConfig[] = [
  {
    id: "instagram-caption-generator",
    title: "Instagram Caption Generator",
    description: "Generate captions for Instagram posts using AI.",
    prompt: "Generate an Instagram caption for: ",
    placeholder: "Describe your photo...",
    buttonText: "Generate Caption",
    category: "Social Media",
    modelType: "text"
  },
  {
    id: "youtube-title-generator",
    title: "YouTube Title Generator",
    description: "Generate high-CTR YouTube titles.",
    prompt: "Generate a YouTube title for: ",
    placeholder: "Describe your video...",
    buttonText: "Generate Title",
    category: "Social Media",
    modelType: "text"
  },
  {
    id: "ai-image-describer",
    title: "AI Image Describer",
    description: "Analyze and describe images using AI vision models.",
    prompt: "Analyze this image and provide a detailed description: ",
    placeholder: "Paste image URL or upload an image...",
    buttonText: "Analyze Image",
    category: "AI Vision",
    modelType: "vision"
  },
  {
    id: "code-explainer",
    title: "Code Explainer",
    description: "Get detailed explanations of code snippets in any programming language.",
    prompt: "Explain this code in detail: ",
    placeholder: "Paste your code here...",
    buttonText: "Explain Code",
    category: "Development",
    modelType: "text"
  },
  {
    id: "seo-meta-description-generator",
    title: "SEO Meta Description Generator",
    description: "Auto-create optimized meta descriptions for blog posts & landing pages.",
    prompt: "Generate an SEO-optimized meta description (150-160 characters) for the following content. Make it compelling and include relevant keywords: ",
    placeholder: "Enter your page title or content summary...",
    buttonText: "Generate Meta Description",
    category: "SEO & Marketing",
    modelType: "text"
  },
  {
    id: "article-outliner",
    title: "Article Outliner",
    description: "Generate structured outlines for long-form articles or blogs.",
    prompt: "Create a detailed article outline with main sections, subsections, and key points for: ",
    placeholder: "Enter your article topic or main idea...",
    buttonText: "Generate Outline",
    category: "Content Writing",
    modelType: "text"
  },
  {
    id: "product-description-generator",
    title: "Product Description Generator",
    description: "Write persuasive e-commerce product descriptions.",
    prompt: "Write a compelling, persuasive product description that highlights benefits and features for: ",
    placeholder: "Enter product name and key features...",
    buttonText: "Generate Description",
    category: "E-commerce",
    modelType: "text"
  },
  {
    id: "linkedin-post-generator",
    title: "LinkedIn Post Generator",
    description: "Professional post drafts tailored for networking & thought leadership.",
    prompt: "Create a professional LinkedIn post that demonstrates thought leadership and encourages engagement. Topic: ",
    placeholder: "Enter your post topic or key message...",
    buttonText: "Generate Post",
    category: "Social Media",
    modelType: "text"
  },
  {
    id: "facebook-ads-copy-generator",
    title: "Facebook Ads Copy Generator",
    description: "Quick ad copy variations for campaigns.",
    prompt: "Generate 3 variations of Facebook ad copy that are attention-grabbing, benefit-focused, and include a clear call-to-action for: ",
    placeholder: "Enter product/service and target audience...",
    buttonText: "Generate Ad Copy",
    category: "Advertising",
    modelType: "text"
  },
  {
    id: "resume-analyzer",
    title: "Resume Analyzer",
    description: "Scan resumes for keyword match, ATS compatibility, and improvements.",
    prompt: "Analyze this resume for ATS compatibility, keyword optimization, and provide specific improvement suggestions: ",
    placeholder: "Paste resume text here...",
    buttonText: "Analyze Resume",
    category: "Career",
    modelType: "text"
  },
  {
    id: "text-summarizer",
    title: "Text Summarizer",
    description: "Condense long articles, reports, or notes into key points.",
    prompt: "Summarize the following text into clear, concise key points while preserving the main ideas: ",
    placeholder: "Paste your long text here...",
    buttonText: "Summarize Text",
    category: "Productivity",
    modelType: "text"
  },
  {
    id: "email-rewriter",
    title: "Email Rewriter",
    description: "Rewrite emails in different tones (formal, casual, persuasive).",
    prompt: "Rewrite the following email in a {{tone}} tone while maintaining the key message: ",
    placeholder: "Paste your email here...",
    buttonText: "Rewrite Email",
    category: "Communication",
    modelType: "text"
  },
  {
    id: "grammar-corrector",
    title: "Grammar Corrector",
    description: "Fix grammar, spelling, and style issues instantly.",
    prompt: "Correct all grammar, spelling, punctuation, and style issues in the following text. Provide the corrected version and explain major changes: ",
    placeholder: "Paste your text here...",
    buttonText: "Check Grammar",
    category: "Writing",
    modelType: "text"
  },
  {
    id: "cold-email-generator",
    title: "Cold Email Generator",
    description: "Writes personalized cold emails for outreach.",
    prompt: "Generate a personalized, compelling cold email for the following scenario. Include a strong subject line, value proposition, and clear call-to-action: ",
    placeholder: "Describe recipient, purpose, and what you offer...",
    buttonText: "Generate Cold Email",
    category: "Sales",
    modelType: "text"
  },
  {
    id: "plagiarism-checker",
    title: "Plagiarism Checker",
    description: "Checks plagiarism of specific content and gives a score.",
    prompt: "Analyze the following text for potential plagiarism indicators, clichés, and overused phrases. Provide an originality assessment with specific examples: ",
    placeholder: "Paste content to check...",
    buttonText: "Check Plagiarism",
    category: "Writing",
    modelType: "text"
  }
];

export function getToolConfig(id: string) {
  return tools.find(t => t.id === id);
}

export function getToolsByCategory(category: string) {
  return tools.filter(t => t.category === category);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(tools.map(t => t.category).filter((c): c is string => Boolean(c))));
}
