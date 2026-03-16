"use client";

import type { CitationResult } from "@/lib/types";

interface Props {
  results: CitationResult[];
  brandName: string;
}

const MODEL_COLORS: Record<string, string> = {
  "Perplexity": "from-cyan-500 to-blue-500",
  "ChatGPT": "from-green-500 to-emerald-600",
  "Gemini": "from-blue-500 to-indigo-600",
  "Claude": "from-orange-500 to-amber-600",
};

const MODEL_ICONS: Record<string, string> = {
  "Perplexity": "🔍",
  "ChatGPT": "💬",
  "Gemini": "✨",
  "Claude": "🤖",
};

const SENTIMENT_CONFIG = {
  positive: { label: "Positive", color: "text-green-400", bg: "bg-green-500/10" },
  neutral: { label: "Neutral", color: "text-yellow-400", bg: "bg-yellow-500/10" },
  negative: { label: "Negative", color: "text-red-400", bg: "bg-red-500/10" },
  not_mentioned: { label: "Not Mentioned", color: "text-white/40", bg: "bg-white/5" },
};

export default function ResultsDashboard({ results, brandName }: Props) {
  const citedCount = results.filter((r) => r.cited).length;
  const totalScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
    : 0;
  
  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-400";
    if (score >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return "Strong presence";
    if (score >= 40) return "Moderate visibility";
    if (score > 0) return "Weak presence";
    return "Not found";
  };

  return (
    <div className="text-left space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Score header */}
      <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/30 border border-indigo-500/20 rounded-2xl p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="text-sm text-white/50 mb-1 uppercase tracking-wider font-medium">AI Citation Score for</div>
            <h2 className="text-2xl font-bold">{brandName}</h2>
            <p className="text-white/50 text-sm mt-1">{getScoreLabel(totalScore)}</p>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className={`text-5xl font-bold ${getScoreColor(totalScore)}`}>{totalScore}</div>
              <div className="text-xs text-white/40 mt-1">/ 100</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{citedCount}<span className="text-white/40 text-lg">/{results.length}</span></div>
              <div className="text-xs text-white/40 mt-1">models cited you</div>
            </div>
          </div>
        </div>

        {/* Score bar */}
        <div className="mt-6">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
              style={{ width: `${totalScore}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Model cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {results.map((result, idx) => {
          const sentiment = SENTIMENT_CONFIG[result.sentiment];
          const gradientClass = MODEL_COLORS[result.aiModel] || "from-gray-500 to-gray-600";
          return (
            <div
              key={idx}
              className={`bg-white/[0.03] border rounded-xl p-6 transition-colors ${result.cited ? 'border-white/15 hover:border-white/25' : 'border-white/8 opacity-75'}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center text-lg`}>
                    {MODEL_ICONS[result.aiModel] || "🤖"}
                  </div>
                  <div>
                    <div className="font-semibold">{result.aiModel}</div>
                    <div className="text-xs text-white/40">{result.query}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getScoreColor(result.score)}`}>{result.score}</div>
                  <div className="text-xs text-white/40">score</div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs px-2 py-0.5 rounded-full ${sentiment.bg} ${sentiment.color}`}>
                  {sentiment.label}
                </span>
                {result.prominence !== "none" && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40 capitalize">
                    {result.prominence} mention
                  </span>
                )}
                {result.cited && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">
                    ✓ Cited
                  </span>
                )}
              </div>

              {result.snippet ? (
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-white/60 leading-relaxed italic">&ldquo;{result.snippet}&rdquo;</p>
                </div>
              ) : (
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-white/30 italic">Your brand was not mentioned in this query context.</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recommendations */}
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <span>💡</span> How to improve your AI citation score
        </h3>
        <ul className="space-y-3 text-sm text-white/60">
          {[
            "Publish detailed comparison articles mentioning your competitors — AI models learn from comparison content",
            "Get featured in listicle-style articles like 'Top 10 [category] tools' — these are heavily cited by AI",
            "Create a clear, crawlable product description page with your key differentiators",
            "Build topical authority with blog content in your niche — AI citations follow expertise",
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
