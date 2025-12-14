import { Metadata } from "next";
import { siteConfig, defaultMetadata } from "@/config/seo";

// Generate metadata for tool pages
export function generateToolMetadata(params: {
  title: string;
  description: string;
  keywords: string[];
  slug: string;
  ogImage?: string;
  publishDate?: string;
  lastModified?: string;
}): Metadata {
  const { title, description, keywords, slug, ogImage, publishDate, lastModified } = params;
  const url = `${siteConfig.url}/tools/${slug}`;
  const image = ogImage || `${siteConfig.url}/og-images/${slug}.png`;
  
  return {
    title: `${title} | ${siteConfig.name}`,
    description,
    keywords,
    authors: [{ name: siteConfig.author }],
    creator: siteConfig.author,
    publisher: siteConfig.name,
    alternates: {
      canonical: url
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      ...(publishDate && { publishedTime: publishDate }),
      ...(lastModified && { modifiedTime: lastModified })
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: siteConfig.twitterHandle,
      images: [image]
    },
    ...defaultMetadata,
    other: {
      ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION && {
        "google-site-verification": process.env.NEXT_PUBLIC_GSC_VERIFICATION
      })
    }
  };
}

// Generate metadata for blog posts
export function generateBlogMetadata(params: {
  title: string;
  excerpt: string;
  slug: string;
  keywords: string[];
  author: string;
  publishDate: string;
  ogImage?: string;
  category?: string;
}): Metadata {
  const { title, excerpt, slug, keywords, author, publishDate, ogImage, category } = params;
  const url = `${siteConfig.url}/blog/${slug}`;
  const image = ogImage || `${siteConfig.url}/blog-images/default.png`;
  
  return {
    title: `${title} | ${siteConfig.name} Blog`,
    description: excerpt,
    keywords,
    authors: [{ name: author }],
    category,
    alternates: {
      canonical: url
    },
    openGraph: {
      type: "article",
      locale: siteConfig.locale,
      url,
      title,
      description: excerpt,
      siteName: siteConfig.name,
      publishedTime: publishDate,
      authors: [author],
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: excerpt,
      creator: siteConfig.twitterHandle,
      images: [image]
    },
    ...defaultMetadata
  };
}

// Generate JSON-LD for tool pages (SoftwareApplication schema)
export function generateToolJsonLd(params: {
  name: string;
  description: string;
  slug: string;
  category: string;
  ratingValue?: string;
  ratingCount?: string;
}) {
  const { name, description, slug, category, ratingValue, ratingCount } = params;
  
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": name,
    "description": description,
    "url": `${siteConfig.url}/tools/${slug}`,
    "applicationCategory": category,
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    ...(ratingValue && ratingCount && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": ratingValue,
        "ratingCount": ratingCount,
        "bestRating": "5",
        "worstRating": "1"
      }
    }),
    "author": {
      "@type": "Organization",
      "name": siteConfig.name,
      "url": siteConfig.url
    },
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.name,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteConfig.url}/logo.png`
      }
    }
  };
}

// Generate FAQ JSON-LD for rich snippets
export function generateFAQJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

// Generate Breadcrumb JSON-LD
export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

// Generate Blog Posting JSON-LD
export function generateBlogPostJsonLd(params: {
  title: string;
  excerpt: string;
  slug: string;
  author: string;
  publishDate: string;
  modifiedDate: string;
  image: string;
  wordCount: number;
}) {
  const { title, excerpt, slug, author, publishDate, modifiedDate, image, wordCount } = params;
  
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": excerpt,
    "image": image,
    "datePublished": publishDate,
    "dateModified": modifiedDate,
    "author": {
      "@type": "Person",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.name,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteConfig.url}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${slug}`
    },
    "wordCount": wordCount
  };
}

// Generate Organization JSON-LD (for homepage)
export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteConfig.name,
    "url": siteConfig.url,
    "logo": `${siteConfig.url}/logo.png`,
    "description": siteConfig.description,
    "sameAs": [
      "https://twitter.com/aistackly",
      "https://linkedin.com/company/aistackly",
      "https://facebook.com/aistackly",
      "https://instagram.com/aistackly"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "email": "support@aistackly.com"
    }
  };
}

// Generate WebSite JSON-LD (for homepage)
export function generateWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteConfig.name,
    "url": siteConfig.url,
    "description": siteConfig.description,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteConfig.url}/tools?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}

// Generate ItemList JSON-LD for tool listings
export function generateToolListJsonLd(tools: Array<{ name: string; slug: string; description: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": tools.map((tool, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "SoftwareApplication",
        "name": tool.name,
        "description": tool.description,
        "url": `${siteConfig.url}/tools/${tool.slug}`
      }
    }))
  };
}
