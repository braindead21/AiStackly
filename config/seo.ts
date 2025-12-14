export const siteConfig = {
  name: "AIStackly",
  title: "AIStackly - Free AI Tools for Content Creation, SEO & Marketing",
  description: "Access 15+ free AI-powered tools for content writing, SEO optimization, social media, and marketing. Generate captions, analyze images, write code explanations, and more.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://aistackly.com",
  ogImage: "/og-default.png",
  author: "AIStackly Team",
  twitterHandle: "@aistackly",
  keywords: [
    "AI tools",
    "free AI tools",
    "AI content generator",
    "AI writing assistant",
    "SEO tools",
    "social media tools",
    "AI image analyzer",
    "code explainer",
    "marketing automation",
    "instagram caption generator",
    "youtube title generator",
    "content creation ai"
  ],
  locale: "en_US",
  type: "website"
};

// Google Analytics & Search Console
export const gaTrackingId = process.env.NEXT_PUBLIC_GA_ID || ""; // Add your GA4 ID
export const gscVerification = process.env.NEXT_PUBLIC_GSC_VERIFICATION || "";

// SEO defaults
export const defaultMetadata = {
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large" as const,
      "max-snippet": -1
    }
  }
};

// Tool categories for navigation and SEO
export const toolCategories = [
  {
    name: "Social Media",
    slug: "social-media",
    description: "AI tools for Instagram, YouTube, LinkedIn, Facebook, and Twitter content creation",
    icon: "📱"
  },
  {
    name: "SEO & Marketing",
    slug: "seo-marketing",
    description: "SEO optimization tools for meta descriptions, keywords, and content strategy",
    icon: "📈"
  },
  {
    name: "Content Writing",
    slug: "content-writing",
    description: "AI writing assistants for articles, blogs, and long-form content",
    icon: "✍️"
  },
  {
    name: "Development",
    slug: "development",
    description: "Code explanation, debugging, and developer productivity tools",
    icon: "💻"
  },
  {
    name: "E-commerce",
    slug: "ecommerce",
    description: "Product descriptions, listings, and e-commerce content generators",
    icon: "🛒"
  },
  {
    name: "Career",
    slug: "career",
    description: "Resume analysis, cover letters, and job application tools",
    icon: "💼"
  },
  {
    name: "Communication",
    slug: "communication",
    description: "Email rewriting, tone adjustment, and professional communication",
    icon: "✉️"
  },
  {
    name: "Productivity",
    slug: "productivity",
    description: "Text summarization, note-taking, and workflow automation",
    icon: "⚡"
  },
  {
    name: "AI Vision",
    slug: "ai-vision",
    description: "Image analysis, description, and visual content understanding",
    icon: "👁️"
  }
];
