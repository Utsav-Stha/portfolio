import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Utsav Shrestha | Full Stack Developer Portfolio",
  description: "Full Stack Developer from Nepal specializing in React, Next.js, and Node.js. View my projects, skills, and experience in modern web development.",
  keywords: "Full Stack Developer, React Developer, Next.js, Node.js, TypeScript, Web Development, Nepal, Portfolio",
  authors: [{ name: "Utsav Shrestha" }],
  creator: "Utsav Shrestha",
  publisher: "Utsav Shrestha",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://utsav-portfolio.vercel.app",
    title: "Utsav Shrestha | Full Stack Developer Portfolio",
    description: "Full Stack Developer from Nepal specializing in React, Next.js, and Node.js. View my projects, skills, and experience in modern web development.",
    siteName: "Utsav Shrestha Portfolio",
    images: [
      {
        url: "https://utsav-portfolio.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Utsav Shrestha - Full Stack Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Utsav Shrestha | Full Stack Developer Portfolio",
    description: "Full Stack Developer from Nepal specializing in React, Next.js, and Node.js.",
    creator: "@utsav_stha",
    images: ["https://utsav-portfolio.vercel.app/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Utsav Shrestha",
    "jobTitle": "Full Stack Developer",
    "description": "Full Stack Developer from Nepal specializing in React, Next.js, and Node.js",
    "url": "https://utsav-portfolio.vercel.app",
    "image": "https://utsav-portfolio.vercel.app/og-image.jpg",
    "sameAs": [
      "https://github.com/Utsav-Stha",
      "https://linkedin.com/in/utsav-stha",
      "https://twitter.com/utsav_stha"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kathmandu",
      "addressCountry": "Nepal"
    },
    "knowsAbout": [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "Full Stack Development",
      "Web Development"
    ],
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
