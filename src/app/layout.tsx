import type { Metadata } from "next"
import "./globals.css"
import CustomCursor from "@/components/ui/CustomCursor"

export const metadata: Metadata = {
  title: "Biltechie — Web3 Developer & NFT Builder",
  description: "Smart contracts, generative NFT systems, full-stack dApps, and interactive Web3 experiences. Based in Nigeria, building on-chain.",
  keywords: ["Web3 developer", "NFT developer", "Smart contracts", "Solidity", "Next.js", "Nigeria"],
  openGraph: {
    title: "Biltechie — Web3 Developer & NFT Builder",
    description: "Smart contracts, generative NFT systems, full-stack dApps, and interactive Web3 experiences.",
    url: "https://www.biltechie.xyz",
    siteName: "Biltechie",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Biltechie — Web3 Developer & NFT Builder",
    creator: "@biltechie",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <CustomCursor />
        {children}
      </body>
    </html>
  )
}
