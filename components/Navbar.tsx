"use client";

import * as React from "react";
import Link from "next/link";
import { useState } from "react";
import AuthButton from "./auth/AuthButton";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 backdrop-blur bg-[#050814]/80 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <h1 className="text-indigo-200 font-bold text-2xl">AiStackly</h1>
            </Link>
          </div>

          {/* Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-slate-200 hover:text-indigo-200 font-medium transition-colors">Home</Link>
            <Link href="/tools" className="text-slate-200 hover:text-indigo-200 font-medium transition-colors">Tools</Link>
            <Link href="/about" className="text-slate-200 hover:text-indigo-200 font-medium transition-colors">About</Link>
            <Link href="/contact" className="text-slate-200 hover:text-indigo-200 font-medium transition-colors">Contact</Link>
            <AuthButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setOpen(!open)} className="text-slate-200 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-2 pt-2 pb-4 space-y-1 bg-[#0c1224]/90 border-t border-white/5 shadow-md">
          <Link href="/" className="block text-slate-200 hover:text-indigo-200 font-medium transition-colors">Home</Link>
          <Link href="/tools" className="block text-slate-200 hover:text-indigo-200 font-medium transition-colors">Tools</Link>
          <Link href="/about" className="block text-slate-200 hover:text-indigo-200 font-medium transition-colors">About</Link>
          <Link href="/contact" className="block text-slate-200 hover:text-indigo-200 font-medium transition-colors">Contact</Link>
          <div className="pt-2">
            <AuthButton />
          </div>
        </div>
      )}
    </nav>
  );
}
