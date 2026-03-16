"use client";

import { useState } from "react";

interface CheckFormProps {
  onCheck: (brand: string, domain: string) => void;
  isChecking: boolean;
}

export default function CheckForm({ onCheck, isChecking }: CheckFormProps) {
  const [brand, setBrand] = useState("");
  const [domain, setDomain] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand.trim()) return;
    onCheck(brand.trim(), domain.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-left">
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Brand Name</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="e.g. Notion, Stripe, OpenAI"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder-white/25 focus:outline-none focus:border-indigo-500 transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Domain (optional)</label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="e.g. notion.so"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder-white/25 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isChecking || !brand.trim()}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isChecking ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Scanning AI models…
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Check My AI Citations — Free
          </>
        )}
      </button>
      <p className="text-center text-xs text-white/30 mt-3">No signup required · Results in ~30 seconds</p>
    </form>
  );
}
