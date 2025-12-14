import "./globals.css";
import type { Metadata } from "next";
import AuthProvider from "@/components/auth/AuthProvider";

export const metadata: Metadata = {
  title: {
    default: "AI Stackly - Free AI Tools for Content & Productivity",
    template: "%s | AI Stackly"
  },
  description: "Discover 15+ free AI-powered tools for content creation, SEO, social media, writing, and more. No sign-up required. Powered by Groq's ultra-fast AI models.",
  keywords: ["ai tools", "free ai", "content generator", "seo tools", "writing assistant", "ai copywriting", "groq ai"],
  authors: [{ name: "AI Stackly" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "AI Stackly",
    title: "AI Stackly - Free AI Tools for Content & Productivity",
    description: "15+ free AI-powered tools for content creation, SEO, and productivity. No sign-up required.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Stackly - Free AI Tools",
    description: "15+ free AI-powered tools for content creation and productivity",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({ children }: any) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1419] to-[#1a1f2e] text-gray-100 antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

