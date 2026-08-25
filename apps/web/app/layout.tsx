import type { Metadata } from "next";
import { Texturina } from "next/font/google";
import "./globals.css";

const texturina = Texturina({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-texturina",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Brooklyn Restaurant",
  description: "Brooklyn Restaurant - Fine Dining Experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-theme="dark">
      <body
        className={`${texturina.variable} min-h-screen w-full bg-background text-foreground antialiased`}
      >
        <main>{children}</main>
      </body>
    </html>
  );
}
