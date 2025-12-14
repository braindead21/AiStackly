import * as React from "react";

export default function Footer() {
  return (
    <footer className="relative bg-[#0a0e1a] border-t border-gray-800/50">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/5 via-transparent to-purple-900/5"></div>
      <div className="container-base py-8 flex flex-col md:flex-row items-center justify-between gap-4 relative">
        <p className="text-sm text-gray-400">© {new Date().getFullYear()} AiStackly. All rights reserved.</p>
        <div className="flex items-center gap-6 text-sm">
          <a href="/privacy" className="text-gray-400 hover:text-indigo-400 transition-colors">Privacy</a>
          <a href="/terms" className="text-gray-400 hover:text-indigo-400 transition-colors">Terms</a>
          <a href="/contact" className="text-gray-400 hover:text-indigo-400 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}