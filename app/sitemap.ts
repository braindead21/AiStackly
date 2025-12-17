import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://aistackly.vercel.app';
  
  // Static list of all tools - no dynamic imports or async operations
  const toolIds = [
    'instagram-caption-generator',
    'youtube-title-generator',
    'ai-image-describer',
    'code-explainer',
    'seo-meta-description-generator',
    'article-outliner',
    'product-description-generator',
    'linkedin-post-generator',
    'facebook-ads-copy-generator',
  ];

  const sitemap: MetadataRoute.Sitemap = [
    // Homepage - highest priority
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    // Tools index page
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    // Individual tool pages
    ...toolIds.map((toolId) => ({
      url: `${baseUrl}/tools/${toolId}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];

  return sitemap;
}
