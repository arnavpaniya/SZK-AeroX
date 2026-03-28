import type { Metadata } from "next";
import { Inter, Manrope, Dancing_Script, Bebas_Neue, JetBrains_Mono, DM_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-calligraphy",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dmsans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SZK AeroX",
  description: "The Future of Unmanned Aerial Vehicles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} ${dancingScript.variable} ${bebasNeue.variable} ${jetbrainsMono.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="font-inter min-h-full flex flex-col">
        {/* Navigation / Header Placeholders */}
        <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 md:p-8 pointer-events-none mix-blend-difference text-white/50">
           {/* Left side */}
           <div className="flex items-center gap-6 pointer-events-auto">
             {/* Sidebar Menu Icon Placeholder */}
             <button className="flex flex-col gap-1.5 p-2 hover:opacity-100 transition-opacity opacity-70" aria-label="Menu">
               <div className="w-7 h-[2px] bg-current"></div>
               <div className="w-7 h-[2px] bg-current"></div>
               <div className="w-5 h-[2px] bg-current"></div>
             </button>
             <a href="/" className="font-sans font-bold text-xl md:text-2xl uppercase tracking-[0.2em] opacity-80 hover:opacity-100 transition-opacity">
               SZK AeroX
             </a>
           </div>
           
           {/* Right side */}
           <div className="flex items-center gap-8 pointer-events-auto font-mono text-xs md:text-sm tracking-[0.15em] uppercase opacity-70">
             <a href="/team" className="hover:opacity-100 transition-opacity">Our Team</a>
             <a href="/pre-order" className="hover:opacity-100 transition-opacity">Pre Order</a>
           </div>
        </header>
        
        {children}
      </body>
    </html>
  );
}
