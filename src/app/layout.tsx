import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner"; //

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Горизонт | Умный Город",
  description: "Платформа мониторинга городской среды",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body className={`${inter.className} bg-horizon-bg text-horizon-text overflow-hidden`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-8 bg-horizon-bg">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}