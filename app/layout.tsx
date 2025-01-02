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
  title: "Career Roadmap Generator | Plan Your Professional Journey",
  description:
    "Create a personalized career roadmap with our advanced generator. Identify goals, plan steps, and achieve your dream career effortlessly.",
  keywords: [
    "Career roadmap generator",
    "Professional journey planner",
    "Career planning tool",
    "Personalized career guide",
    "Achieve career goals",
  ],
  openGraph: {
    title: "Career Roadmap Generator - Plan Your Professional Journey",
    description:
      "Design your career roadmap with tailored insights and actionable steps. Take charge of your professional future today.",
    url: "https://gridsandguides.com/career-roadmap", // Replace with the exact page URL
    type: "website",
    images: [
      {
        url: "https://gridsandguides.com/career-roadmap/og-image.jpg", // Replace with the actual image path
        alt: "Career Roadmap Generator - Plan Your Professional Journey",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="canonical"
          href="https://fluency-poc.vercel.app" // Replace with the exact page URL
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Career Roadmap Generator",
              url: "https://fluency-poc.vercel.app", // Replace with the exact page URL
              description:
                "Generate a detailed and actionable roadmap for your career. Identify goals, steps, and timelines with ease.",
              applicationCategory: "ProductivityApplication",
              operatingSystem: "All",
              sameAs: [
                "https://www.linkedin.com/company/grids-and-guides",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
