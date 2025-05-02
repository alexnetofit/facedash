import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FaceDash - Acompanhe suas métricas do Facebook Ads",
  description: "Monitore suas campanhas do Facebook Ads com facilidade",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
