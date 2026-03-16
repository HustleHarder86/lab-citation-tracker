import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBrandBySlug, getAllSlugs, Brand } from '../../../data/brands';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) return {};

  return {
    title: `${brand.name} AI Citation Score — Is AI Recommending You?`,
    description: `Check if ChatGPT, Perplexity, Claude, and other AI chatbots recommend ${brand.name}. Free AI visibility report. Score: ${brand.score}/100.`,
    openGraph: {
      title: `${brand.name} AI Citation Score — Is AI Recommending You?`,
      description: `${brand.name} has an AI citation score of ${brand.score}/100. Find out which AI models mention ${brand.name} and how your brand compares.`,
      type: 'website',
      url: `https://lab-citation-tracker.vercel.app/brands/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${brand.name} AI Citation Score`,
      description: `AI visibility score for ${brand.name}: ${brand.score}/100. See which AI chatbots recommend this brand.`,
    },
  };
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-green-500' : score >= 40 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="w-full bg-gray-200 rounded-full h-4">
      <div
        className={`${color} h-4 rounded-full transition-all`}
        style={{ width: `${score}%` }}
      />
    </div>
  );
}

function TierBadge({ tier }: { tier: Brand['tier'] }) {
  if (tier === 'prominent') {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
        ✅ Prominently Mentioned
      </span>
    );
  }
  if (tier === 'passing') {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
        ⚠️ Mentioned in Passing
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
      ❌ Not Mentioned
    </span>
  );
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  const mentionedCount = brand.aiMentions.filter((m) => m.mentioned).length;
  const totalModels = brand.aiMentions.length;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Report',
    name: `${brand.name} AI Citation Report`,
    description: `AI visibility and citation analysis for ${brand.name} across major AI chatbots.`,
    about: {
      '@type': 'Organization',
      name: brand.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'AI Citation Tracker',
      url: 'https://lab-citation-tracker.vercel.app',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-indigo-600">
              AI Citation Tracker
            </a>
            <a
              href="/"
              className="text-sm text-gray-600 hover:text-indigo-600"
            >
              ← Check your brand
            </a>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-12">
          {/* Hero */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">{brand.category}</p>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {brand.name} AI Citation Report
                </h1>
                <p className="text-gray-600 max-w-xl">{brand.description}</p>
              </div>
              <div className="text-center md:text-right">
                <div className="text-6xl font-black text-indigo-600">{brand.score}</div>
                <div className="text-sm text-gray-500">out of 100</div>
                <div className="mt-2">
                  <TierBadge tier={brand.tier} />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>AI Citation Score</span>
                <span>{brand.score}/100</span>
              </div>
              <ScoreBar score={brand.score} />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {mentionedCount}/{totalModels}
                </div>
                <div className="text-xs text-gray-500">AI Models</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {brand.score}
                </div>
                <div className="text-xs text-gray-500">Your Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {brand.categoryAverage}
                </div>
                <div className="text-xs text-gray-500">Category Avg</div>
              </div>
            </div>
          </div>

          {/* AI Model Breakdown */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Which AI Models Mention {brand.name}?
            </h2>
            <div className="space-y-4">
              {brand.aiMentions.map((mention) => (
                <div
                  key={mention.model}
                  className={`flex items-start gap-4 p-4 rounded-xl border ${
                    mention.mentioned
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="text-2xl">{mention.mentioned ? '✅' : '❌'}</div>
                  <div>
                    <div className="font-semibold text-gray-900">{mention.model}</div>
                    <div className="text-sm text-gray-600">
                      {mention.mentioned
                        ? mention.context
                        : `${brand.name} was not cited by ${mention.model} in standard recommendation queries.`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              How {brand.name} Compares
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-indigo-600">{brand.name}</span>
                  <span className="text-gray-600">{brand.score}/100</span>
                </div>
                <ScoreBar score={brand.score} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">{brand.category} Average</span>
                  <span className="text-gray-600">{brand.categoryAverage}/100</span>
                </div>
                <ScoreBar score={brand.categoryAverage} />
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              {brand.score > brand.categoryAverage
                ? `✅ ${brand.name} scores ${brand.score - brand.categoryAverage} points above the ${brand.category} category average.`
                : brand.score === brand.categoryAverage
                ? `${brand.name} scores exactly at the ${brand.category} category average.`
                : `⚠️ ${brand.name} scores ${brand.categoryAverage - brand.score} points below the ${brand.category} category average. There's an opportunity to improve AI visibility.`}
            </p>
          </div>

          {/* CTA */}
          <div className="bg-indigo-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">
              {brand.tier === 'not-mentioned'
                ? `Is Your Brand Being Ignored by AI?`
                : `Track Your Brand's AI Visibility Over Time`}
            </h2>
            <p className="text-indigo-200 mb-6 max-w-xl mx-auto">
              {brand.tier === 'not-mentioned'
                ? `${brand.name} isn't being recommended by AI chatbots — that means potential customers asking AI for solutions aren't hearing about you. Monitor your AI visibility and get alerted when that changes.`
                : `AI recommendations change. Monitor when ${brand.name} gets mentioned, track your score over time, and get alerts for any changes in AI visibility.`}
            </p>
            <a
              href="/"
              className="inline-block bg-white text-indigo-600 font-semibold px-8 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
            >
              Monitor Your Brand's AI Visibility — Free
            </a>
            <p className="mt-3 text-xs text-indigo-300">
              No credit card required • Get your citation score in 30 seconds
            </p>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-gray-400 mt-8">
            Data based on AI citation analysis across ChatGPT, Claude, Perplexity, and Gemini.
            Scores are updated periodically. Last analyzed: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.
          </p>
        </main>
      </div>
    </>
  );
}
