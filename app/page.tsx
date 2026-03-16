"use client";

import { useState } from "react";
import CheckForm from "@/components/CheckForm";
import ResultsDashboard from "@/components/ResultsDashboard";
import type { CitationResult } from "@/lib/types";

export default function Home() {
  const [results, setResults] = useState<CitationResult[] | null>(null);
  const [brandName, setBrandName] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [emailCaptured, setEmailCaptured] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitting, setEmailSubmitting] = useState(false);

  const handleCheck = async (brand: string, domain: string) => {
    setBrandName(brand);
    setIsChecking(true);
    setResults(null);
    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand, domain }),
      });
      const data = await res.json();
      setResults(data.results);
    } catch (e) {
      console.error(e);
    } finally {
      setIsChecking(false);
    }
  };

  const handleEmailCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setEmailSubmitting(true);
    try {
      await fetch("/api/capture-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setEmailCaptured(true);
    } finally {
      setEmailSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Nav */}
      <nav className="border-b border-white/5 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="font-bold text-lg">CitationTracker<span className="text-indigo-400">.ai</span></span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/60">
            <a href="#how-it-works" className="hover:text-white transition-colors hidden md:block">How it works</a>
            <a href="#pricing" className="hover:text-white transition-colors hidden md:block">Pricing</a>
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Get Early Access
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-sm text-indigo-400 mb-8">
          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
          The new frontier of search is AI — are you in it?
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Are AI chatbots
          <br />
          <span className="text-gradient">recommending</span> your business?
        </h1>
        <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
          Millions of people ask ChatGPT, Perplexity, and Gemini to recommend products every day.
          Find out if your brand is being cited — and how to rank higher.
        </p>
        
        {/* Check Form */}
        <div className="max-w-2xl mx-auto">
          <CheckForm onCheck={handleCheck} isChecking={isChecking} />
        </div>

        {results && !isChecking && (
          <div className="mt-12">
            <ResultsDashboard results={results} brandName={brandName} />
          </div>
        )}

        {isChecking && (
          <div className="mt-16 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin"></div>
            <p className="text-white/60 text-sm">Querying AI models for your brand…</p>
            <div className="flex gap-2 text-xs text-white/40">
              <span className="bg-white/5 px-3 py-1 rounded-full">ChatGPT ✓</span>
              <span className="bg-white/5 px-3 py-1 rounded-full">Perplexity ✓</span>
              <span className="bg-white/5 px-3 py-1 rounded-full">Gemini scanning…</span>
            </div>
          </div>
        )}
      </section>

      {/* Social proof strip */}
      <section className="border-y border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-8 text-white/40 text-sm">
          {["ChatGPT", "Perplexity", "Gemini", "Claude", "Copilot"].map((ai) => (
            <span key={ai} className="flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-500/60" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {ai}
            </span>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-center mb-4">How it works</h2>
        <p className="text-white/50 text-center mb-16 max-w-xl mx-auto">
          AI citation tracking in three simple steps
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Enter your brand",
              desc: "Tell us your brand name and website domain. Takes 10 seconds.",
              icon: "🏷️"
            },
            {
              step: "02",
              title: "We query AI models",
              desc: "We ask ChatGPT, Perplexity, Gemini, and Claude hundreds of relevant questions about your category.",
              icon: "🤖"
            },
            {
              step: "03",
              title: "Get your citation score",
              desc: "See exactly where you're cited, what context, and how to improve your AI visibility.",
              icon: "📊"
            }
          ].map((item) => (
            <div key={item.step} className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 hover:border-indigo-500/30 transition-colors">
              <div className="text-4xl mb-4">{item.icon}</div>
              <div className="text-xs font-mono text-indigo-400 mb-2">{item.step}</div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-indigo-950/30 border-y border-indigo-500/10 py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          {[
            { value: "62%", label: "of consumers use AI for product recommendations" },
            { value: "3.4x", label: "more likely to click brands mentioned by AI" },
            { value: "$0", label: "spent on traditional SEO by AI-cited brands" },
          ].map((stat) => (
            <div key={stat.value}>
              <div className="text-4xl font-bold text-gradient mb-2">{stat.value}</div>
              <div className="text-white/50 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-center mb-4">Simple pricing</h2>
        <p className="text-white/50 text-center mb-16">Start free, scale as you grow</p>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              name: "Starter",
              price: "$0",
              period: "forever",
              features: ["1 brand check/day", "3 AI models", "Basic citation score", "Email alerts"],
              cta: "Start free",
              highlight: false,
            },
            {
              name: "Pro",
              price: "$29",
              period: "/month",
              features: ["Unlimited checks", "5 AI models", "Detailed citation report", "Competitor tracking", "Weekly email digest", "API access"],
              cta: "Get early access",
              highlight: true,
            },
            {
              name: "Agency",
              price: "$99",
              period: "/month",
              features: ["10 brands", "All AI models", "White-label reports", "Priority support", "Slack alerts", "Custom queries"],
              cta: "Contact us",
              highlight: false,
            }
          ].map((plan) => (
            <div key={plan.name} className={`rounded-2xl p-8 border ${plan.highlight ? 'bg-indigo-600/20 border-indigo-500/50 card-glow' : 'bg-white/[0.03] border-white/10'}`}>
              {plan.highlight && <div className="text-xs font-semibold text-indigo-400 mb-4 uppercase tracking-wider">Most Popular</div>}
              <div className="text-lg font-semibold mb-1">{plan.name}</div>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-white/40 mb-1">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                    <svg className="w-4 h-4 text-indigo-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-xl font-medium text-sm transition-colors ${plan.highlight ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-white/10 hover:bg-white/15 text-white'}`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Email capture CTA */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 rounded-3xl p-12">
          <h2 className="text-3xl font-bold mb-4">Get early access</h2>
          <p className="text-white/60 mb-8">Join 200+ founders tracking their AI visibility. Be first to know when we launch.</p>
          {emailCaptured ? (
            <div className="flex items-center justify-center gap-2 text-green-400 font-medium">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              You're on the list! We'll be in touch.
            </div>
          ) : (
            <form onSubmit={handleEmailCapture} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourcompany.com"
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm placeholder-white/30 focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
              <button
                type="submit"
                disabled={emailSubmitting}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {emailSubmitting ? "…" : "Join waitlist"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center text-white/30 text-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span>© 2025 CitationTracker.ai — All rights reserved</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="mailto:hello@citationtracker.ai" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
