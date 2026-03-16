import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Citation Tracker — Are AI Chatbots Recommending Your Business?",
  description: "Monitor when ChatGPT, Perplexity, Gemini, and Claude mention your brand. Track AI citations, score your visibility, and optimize for AI search.",
  openGraph: {
    title: "AI Citation Tracker",
    description: "Are AI chatbots recommending your business? Find out in 60 seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#0a0a0f]">
        {children}
      </body>
    </html>
  );
}
