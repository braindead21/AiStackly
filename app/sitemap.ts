import { MetadataRoute } from 'next';
import { tools } from '@/config/tools';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://aistackly.vercel.app';
  const currentDate = new Date();

  // Homepage
  const homepage = {
    url: baseUrl,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: 1.0,
  };

  // Tools index page
  const toolsPage = {
    url: `${baseUrl}/tools`,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  };

  // Individual tool pages
  const toolPages = tools.map((tool) => ({
    url: `${baseUrl}/tools/${tool.id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [homepage, toolsPage, ...toolPages];
}
