"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import AuthModal from "./AuthModal";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [showDropdown, setShowDropdown] = useState(false);

  if (status === "loading") {
    return (
      <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
    );
  }

  if (session?.user) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-medium shadow-lg">
            {session.user.name?.[0]?.toUpperCase() || "U"}
          </div>
          <span className="hidden sm:block text-white font-medium">
            {session.user.name}
          </span>
          <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDropdown && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowDropdown(false)}
            ></div>
            <div className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 py-2 z-20">
              <Link
                href="/profile"
                className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg mx-2 transition-all"
                onClick={() => setShowDropdown(false)}
              >
                Profile
              </Link>
              <Link
                href="/history"
                className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg mx-2 transition-all"
                onClick={() => setShowDropdown(false)}
              >
                History
              </Link>
              <Link
                href="/analytics"
                className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg mx-2 transition-all"
                onClick={() => setShowDropdown(false)}
              >
                Analytics
              </Link>
              <hr className="my-2 border-white/10" />
              <button
                onClick={() => signOut()}
                className="block w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg mx-2 transition-all"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setAuthMode("login");
            setShowAuthModal(true);
          }}
          className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all font-medium"
        >
          Login
        </button>
        <button
          onClick={() => {
            setAuthMode("signup");
            setShowAuthModal(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all font-medium shadow-lg shadow-indigo-500/20"
        >
          Sign Up
        </button>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onSwitchMode={() => setAuthMode(authMode === "login" ? "signup" : "login")}
      />
    </>
  );
}
