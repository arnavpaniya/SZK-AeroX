import type { Metadata } from "next";
import { Inter, Manrope, Dancing_Script, Bebas_Neue, JetBrains_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import GlobalHeader from "@/components/GlobalHeader";


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
        <GlobalHeader />
        

        {children}
      </body>
    </html>
  );
}
