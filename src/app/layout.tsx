import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MD Sites | Criação Automática de Websites com IA",
  description: "Descreve o teu negócio e a nossa Inteligência Artificial cria automaticamente um website moderno, profissional e pronto para publicar.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className={`${outfit.variable} ${inter.variable} h-full antialiased dark`}>
      <body className="min-h-full bg-[#030712] text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
        {children}
      </body>
    </html>
  );
}
