import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  metadataBase: new URL("https://agentic-996f52cd.vercel.app"),
  title: "Agentic Video Generator",
  description:
    "Autonomous AI agent that plans, scripts, and composes ready-to-render marketing videos.",
  openGraph: {
    title: "Agentic Video Generator",
    description:
      "Plan, script, and assemble video storyboards with an AI director tailored to your brand.",
    url: "https://agentic-996f52cd.vercel.app",
    images: [
      {
        url: "/og-cover.svg",
        width: 1200,
        height: 630,
        alt: "Agentic Video Generator"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Agentic Video Generator",
    description:
      "Plan, script, and assemble video storyboards with an AI director tailored to your brand.",
    images: ["/og-cover.svg"]
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-slate-950", inter.variable)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
