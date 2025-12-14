import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/layout/Hero";
import Footer from "@/components/layout/Footer";
import CategoryCard from "@/components/ui/CategoryCard";
import Link from "next/link";
import { tools, getAllCategories } from "@/config/tools";

export default function HomePage() {
  const categories = getAllCategories();
  const featuredTools = tools.slice(0, 6); // Show first 6 tools

  return (
    <main>
      <Navbar />
      <Hero />

      {/* Stats section */}
      <section className="relative bg-[#0a0e1a] py-16 -mt-px">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f1419]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/10 via-transparent to-purple-900/10"></div>
        <div className="container-base relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-white mb-2">{tools.length}</div>
              <div className="text-gray-400">AI Tools</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">{categories.length}</div>
              <div className="text-gray-400">Categories</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">100%</div>
              <div className="text-gray-400">Free</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">0</div>
              <div className="text-gray-400">Sign-up Required</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="relative bg-gradient-to-b from-[#0f1419] to-[#141b2d] py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/10 via-transparent to-purple-900/10"></div>
        <div className="container-base relative">
        <div className="stack">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Popular AI Tools</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">Boost your productivity with our most popular AI-powered tools</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTools.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.id}`}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-xl hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-white group-hover:text-indigo-400 transition-colors">
                    {tool.title}
                  </h3>
                  {tool.modelType === "vision" && (
                    <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                      Vision
                    </span>
                  )}
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  {tool.description}
                </p>
                <div className="flex items-center text-sm text-indigo-400 group-hover:text-indigo-300 transition-colors">
                  Try it now →
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link 
              href="/tools" 
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/50"
            >
              View All {tools.length} Tools
            </Link>
          </div>
        </div>
        </div>
      </section>

      {/* Features section */}
      <section className="relative bg-gradient-to-b from-[#141b2d] to-[#0f1419] py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-transparent to-indigo-900/10"></div>
        <div className="container-base relative">
          <div className="stack">
            <h2 className="text-4xl font-bold text-white text-center mb-4">Why AiStackly</h2>
            <p className="text-center text-gray-300 max-w-2xl mx-auto">Fast, simple AI utilities to boost your productivity — built mobile-first and free to use.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <CategoryCard 
                title="⚡ Instant Results" 
                description="Get AI-powered outputs in seconds using ultra-fast Groq models." 
              />
              <CategoryCard 
                title="🎯 No Sign-up" 
                description="Use all tools without creating an account or sharing data." 
              />
              <CategoryCard 
                title="📱 Mobile-First" 
                description="Optimized responsive layouts work perfectly on any device." 
              />
              <CategoryCard 
                title="✨ Easy to Use" 
                description="Simple, intuitive interface designed for everyone. No learning curve required." 
              />
              <CategoryCard 
                title="💯 100% Free" 
                description="All tools completely free to use, no hidden charges." 
              />
              <CategoryCard 
                title="🚀 Always Updated" 
                description="New tools and features added regularly." 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories section */}
      <section className="relative bg-gradient-to-b from-[#0f1419] to-[#0a0e1a] py-16 pb-24">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/10 via-transparent to-purple-900/10"></div>
        <div className="container-base relative">
        <div className="stack">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Tool Categories</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">Explore our tools organized by use case</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const categoryToolCount = tools.filter(t => t.category === category).length;
              return (
                <Link
                  key={category}
                  href={`/tools?category=${encodeURIComponent(category)}`}
                  className="group relative overflow-hidden p-6 border border-gray-700/50 rounded-2xl hover:border-indigo-500/50 transition-all bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm hover:shadow-xl hover:shadow-indigo-500/10"
                >
                  <div className="relative z-10">
                    <div className="font-bold text-lg text-white mb-3 group-hover:text-indigo-400 transition-colors">
                      {category}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold text-indigo-400">
                        {categoryToolCount}
                      </div>
                      <div className="text-sm text-gray-400">
                        {categoryToolCount === 1 ? 'tool' : 'tools'}
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/0 to-purple-600/0 group-hover:from-indigo-600/5 group-hover:to-purple-600/5 transition-all"></div>
                </Link>
              );
            })}
          </div>
        </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}