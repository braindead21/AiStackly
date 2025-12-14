import * as React from "react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="pt-32 pb-24 text-center">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-400 mb-4">Instant AI Tools for Everyone</h1>
        <p className="text-gray-300 text-lg md:text-xl mb-8">
          Generate captions, emails, resumes, summaries, and more with a single click. Free. No signup required.
        </p>

        {/* CTA Button */}
        <Link href="/tools">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-lg transition">
            Explore Tools
          </button>
        </Link>

        {/* Optional small subtext */}
        <p className="text-gray-400 mt-4 text-sm">
          Trusted by 1,000+ students & creators
        </p>
      </div>
    </section>
  );
}
