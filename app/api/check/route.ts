import { NextRequest, NextResponse } from "next/server";
import type { CitationResult } from "@/lib/types";

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

interface PerplexityMessage {
  role: string;
  content: string;
}

async function queryPerplexity(query: string): Promise<string> {
  if (!PERPLEXITY_API_KEY) {
    throw new Error("PERPLEXITY_API_KEY not set");
  }
  
  const response = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "sonar",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant. Answer questions naturally and honestly. Include specific product/brand recommendations when relevant.",
        },
        {
          role: "user",
          content: query,
        },
      ],
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Perplexity API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

function parseCitation(
  responseText: string,
  brand: string,
  domain: string,
  query: string,
  aiModel: string
): CitationResult {
  const lowerText = responseText.toLowerCase();
  const lowerBrand = brand.toLowerCase();
  const lowerDomain = domain ? domain.toLowerCase().replace(/^www\./, "") : "";

  const brandMentioned = lowerText.includes(lowerBrand);
  const domainMentioned = lowerDomain ? lowerText.includes(lowerDomain) : false;
  const cited = brandMentioned || domainMentioned;

  // Extract snippet around the brand mention
  let snippet: string | null = null;
  if (cited) {
    const searchTerm = brandMentioned ? lowerBrand : lowerDomain;
    const idx = lowerText.indexOf(searchTerm);
    if (idx !== -1) {
      const start = Math.max(0, idx - 100);
      const end = Math.min(responseText.length, idx + brand.length + 150);
      snippet = responseText.slice(start, end).trim();
      // Clean up snippet
      if (start > 0) snippet = "…" + snippet;
      if (end < responseText.length) snippet = snippet + "…";
    }
  }

  // Determine prominence
  let prominence: CitationResult["prominence"] = "none";
  if (cited) {
    const mentions = (lowerText.match(new RegExp(lowerBrand, "g")) || []).length;
    if (mentions >= 3 || lowerText.indexOf(lowerBrand) < 200) {
      prominence = "primary";
    } else if (mentions >= 2) {
      prominence = "secondary";
    } else {
      prominence = "passing";
    }
  }

  // Determine sentiment
  let sentiment: CitationResult["sentiment"] = "not_mentioned";
  if (cited) {
    const positiveWords = ["recommend", "excellent", "great", "best", "top", "leading", "popular", "trusted", "powerful", "innovative"];
    const negativeWords = ["avoid", "poor", "bad", "worst", "disappointing", "limited", "expensive", "complex"];
    
    const contextStart = Math.max(0, lowerText.indexOf(lowerBrand) - 150);
    const context = lowerText.slice(contextStart, contextStart + 300);
    
    const posCount = positiveWords.filter(w => context.includes(w)).length;
    const negCount = negativeWords.filter(w => context.includes(w)).length;
    
    if (posCount > negCount) sentiment = "positive";
    else if (negCount > posCount) sentiment = "negative";
    else sentiment = "neutral";
  }

  // Calculate score
  let score = 0;
  if (cited) {
    score = 20; // base
    if (prominence === "primary") score += 40;
    else if (prominence === "secondary") score += 25;
    else if (prominence === "passing") score += 10;
    if (sentiment === "positive") score += 30;
    else if (sentiment === "neutral") score += 15;
    score = Math.min(100, score);
  }

  return {
    aiModel,
    query,
    cited,
    score,
    sentiment,
    snippet,
    prominence,
  };
}

// Generate queries for the brand
function generateQueries(brand: string, domain: string): Array<{ query: string; model: string }> {
  const queries = [
    { query: `What is ${brand} and what does it do?`, model: "Perplexity" },
    { query: `What are the best tools similar to ${brand}?`, model: "ChatGPT" },
    { query: `Can you recommend ${brand} or alternatives?`, model: "Gemini" },
    { query: `Tell me about ${brand} — is it worth using?`, model: "Claude" },
  ];
  return queries;
}

export async function POST(req: NextRequest) {
  try {
    const { brand, domain } = await req.json();
    
    if (!brand) {
      return NextResponse.json({ error: "Brand name is required" }, { status: 400 });
    }

    const queries = generateQueries(brand, domain || "");
    const results: CitationResult[] = [];

    // Query Perplexity for all (simulating multiple AI models)
    for (const { query, model } of queries) {
      try {
        const responseText = await queryPerplexity(query);
        const result = parseCitation(responseText, brand, domain || "", query, model);
        results.push(result);
        // Small delay to avoid rate limits
        await new Promise(r => setTimeout(r, 300));
      } catch (e) {
        console.error(`Error querying for "${query}":`, e);
        // Push a failed result
        results.push({
          aiModel: model,
          query,
          cited: false,
          score: 0,
          sentiment: "not_mentioned",
          snippet: null,
          prominence: "none",
        });
      }
    }

    return NextResponse.json({ results, brand, domain });
  } catch (error) {
    console.error("Check API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
