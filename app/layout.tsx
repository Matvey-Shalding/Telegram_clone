"use client";

import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from '@/components/shared'

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, "dark")}>
      <body className="antialiased flex">
        <nav>
          <Sidebar />
        </nav>
        {children}
      </body>
    </html>
  );
}
