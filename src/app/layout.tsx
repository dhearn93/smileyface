import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Emoji-only Chat",
  description: "A fun chat application where users communicate using only emojis",
  openGraph: {
    title: "Emoji-only Chat",
    description: "Express yourself through emojis in this real-time chat application",
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Emoji-only Chat",
    description: "Express yourself through emojis in this real-time chat application",
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fff5f5' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a2e' }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className={`${inter.className} h-screen overflow-hidden bg-gradient-to-br from-secondary-light via-primary-light to-accent-light dark:from-primary-dark dark:via-secondary-dark dark:to-accent-dark transition-colors duration-200`}>
        {children}
      </body>
    </html>
  );
}
