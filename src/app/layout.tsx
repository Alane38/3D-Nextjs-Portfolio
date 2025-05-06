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
  title: "TriDfolio",
  description:
    "Explore TriDfolio — a cutting-edge 3D portfolio built with Next.js, Three.js, and React Three Fiber. Experience real-time physics, immersive design, and interactive elements in a next-generation web project.",
  openGraph: {
    title: "TriDfolio",
    type: "website",
    description:
      "TriDfolio is an immersive 3D web portfolio using Next.js, Three.js, and React Three Fiber. Featuring real-time physics, dynamic animations, and a sleek UI — perfect for showcasing modern developer creativity.",
    url: "https://tridfolio.newalfox.fr",
    images: [
      {
        url: "https://newalfox.fr/img/logo_newalfox.png",
        secureUrl: "https://newalfox.fr/img/logo_newalfox.png",
        alt: "TriDfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TriDfolio",
    description:
      "Discover TriDfolio — an interactive 3D portfolio powered by Next.js and Three.js. Physics, animation, and design merge to create a truly immersive developer showcase.",
    creator: "Newalfox, Pamacea",
    images: ["https://newalfox.fr/img/logo_newalfox.png"],
  },
  robots: "index, follow",
  authors: [
    {
      name: "Newalfox",
      url: "https://newalfox.fr",
    },
    {
      name: "Pamacea",
      url: "https://github.com/Pamacea/",
    },
  ],
  icons: "/favicon.ico",
  generator: "Next.js",
  keywords: [
    "3D portfolio",
    "Next.js",
    "Three.js",
    "React Three Fiber",
    "React Three Rapier",
    "web development",
    "interactive experience",
    "physics-based interactions",
    "modern UI",
    "TypeScript",
    "Framer Motion",
    "TailwindCSS",
    "Alane Jaunet",
    "Newalfox",
    "Pamacea",
    "ARCHE",
  ],
  referrer: "origin",
  category: "Technology",
  alternates: {
    canonical: "https://tridfolio.newalfox.fr",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
