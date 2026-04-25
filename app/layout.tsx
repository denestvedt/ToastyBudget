import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "ToastyBudget",
  description: "A CFO-style household budget tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Runs before paint — restores theme, font, and text-size to prevent flash */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{var h=document.documentElement;var t=localStorage.getItem('theme')||'system';h.setAttribute('data-theme',(t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme:dark)').matches))?'dark':'light');var f=localStorage.getItem('font');if(f)h.setAttribute('data-font',f);var s=localStorage.getItem('text-size');if(s)h.setAttribute('data-text-size',s);}catch(e){}})();`,
        }}
      />
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
