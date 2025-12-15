import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1419] to-[#1a1f2e] flex items-center justify-center px-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* 404 Text */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              404
            </h1>
          </div>

          {/* Error Message */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
            >
              Go to Homepage
            </Link>
            <Link
              href="/tools"
              className="px-8 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-indigo-500/50 text-gray-100 font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              Browse AI Tools
            </Link>
          </div>

          {/* Decorative Elements */}
          <div className="mt-16 text-gray-600">
            <p className="text-sm">Looking for something specific?</p>
            <p className="text-sm mt-2">Try searching our tools or return to the homepage.</p>
          </div>
        </div>
      </div>
    </>
  );
}
