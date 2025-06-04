import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { ThemeProvider } from "next-themes";

import { env } from "@/env";

import "./globals.css";

export const metadata: Metadata = {
   metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
   title: "Simple Working Hours App",
   description: "The easy way to track working hours, for free!",
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
         <body className={`${geistSans.className} antialiased`}>
            <ThemeProvider
               attribute="class"
               defaultTheme="system"
               enableSystem
               disableTransitionOnChange
            >
               {children}
            </ThemeProvider>
         </body>
      </html>
   );
}
