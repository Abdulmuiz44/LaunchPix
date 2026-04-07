import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";

export const metadata: Metadata = {
  title: "LaunchPix",
  description: "Turn raw screenshots into polished launch visuals in minutes.",
  openGraph: {
    title: "LaunchPix",
    description: "Deterministic AI-assisted launch visuals for product teams.",
    url: "https://launchpix.app",
    siteName: "LaunchPix",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "LaunchPix",
    description: "Turn raw screenshots into polished launch visuals in minutes."
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
