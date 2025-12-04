import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { ThemeProvider } from "next-themes";

import { env } from "@/env";

import "./globals.css";
import RegisterSW from "./register-sw";
import { ThemeToggle } from "@/components/theme-switcher";

export const metadata: Metadata = {
   metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
   title: "Teemun Tunnit",
   description: "Helppo tapa seurata työtunteja – ilmaiseksi!",
};

const geistSans = Geist({
   variable: "--font-geist-sans",
   display: "swap",
   subsets: ["latin-ext"],
});

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en" suppressHydrationWarning>
         <body
            className={`${geistSans.className} antialiased min-h-screen flex flex-col`}
         >
            <ThemeProvider
               attribute="class"
               defaultTheme="system"
               enableSystem
               disableTransitionOnChange
            >
               {children}
               <footer className="mx-auto mt-auto flex w-full items-center justify-center gap-8 border-t py-16 text-center text-xs">
                  <ThemeToggle />
               </footer>
            </ThemeProvider>
            <RegisterSW />
         </body>
      </html>
   );
}
