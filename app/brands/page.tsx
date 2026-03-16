import { Metadata } from 'next';
import { brands } from '../../data/brands';

export const metadata: Metadata = {
  title: 'AI Citation Reports for 30+ Brands — AI Citation Tracker',
  description:
    'See which brands are mentioned by ChatGPT, Claude, Perplexity, and Gemini. Free AI visibility reports for Asana, HubSpot, Salesforce, Notion, and more.',
};

const tierLabel = {
  prominent: { label: 'Prominently Mentioned', color: 'bg-green-100 text-green-800' },
  passing: { label: 'Mentioned in Passing', color: 'bg-yellow-100 text-yellow-800' },
  'not-mentioned': { label: 'Not Mentioned', color: 'bg-red-100 text-red-800' },
};

export default function BrandsIndex() {
  const grouped = {
    prominent: brands.filter((b) => b.tier === 'prominent'),
    passing: brands.filter((b) => b.tier === 'passing'),
    'not-mentioned': brands.filter((b) => b.tier === 'not-mentioned'),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-indigo-600">
            AI Citation Tracker
          </a>
          <a href="/" className="text-sm text-gray-600 hover:text-indigo-600">
            ← Check your brand
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">AI Citation Reports</h1>
        <p className="text-gray-600 mb-10">
          Pre-analyzed AI visibility scores for {brands.length} popular brands. See who AI chatbots
          recommend — and who they ignore.
        </p>

        {(['prominent', 'passing', 'not-mentioned'] as const).map((tier) => (
          <div key={tier} className="mb-12">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${tierLabel[tier].color}`}
              >
                {tierLabel[tier].label}
              </span>
              <span className="ml-2 text-gray-500 text-base font-normal">
                ({grouped[tier].length} brands)
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {grouped[tier].map((brand) => (
                <a
                  key={brand.slug}
                  href={`/brands/${brand.slug}`}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-indigo-300 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{brand.name}</span>
                    <span className="text-2xl font-bold text-indigo-600">{brand.score}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{brand.category}</p>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        brand.score >= 80
                          ? 'bg-green-500'
                          : brand.score >= 40
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${brand.score}%` }}
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-indigo-600 rounded-2xl p-8 text-center text-white mt-8">
          <h2 className="text-2xl font-bold mb-3">Don&apos;t see your brand?</h2>
          <p className="text-indigo-200 mb-6">
            Check your brand&apos;s AI citation score for free — takes 30 seconds.
          </p>
          <a
            href="/"
            className="inline-block bg-white text-indigo-600 font-semibold px-8 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
          >
            Check My Brand →
          </a>
        </div>
      </main>
    </div>
  );
}
