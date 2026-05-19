import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brownstone AI & Infrastructure",
  description: "Fractional CIO & AI Strategist",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700;900&family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-outfit text-gray-800">
        {children}
      </body>
    </html>
  );
}
