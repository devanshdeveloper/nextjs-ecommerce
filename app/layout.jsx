"use client"

import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import Nav from "@/components/layout/Nav";
import ThemeButton from "@/components/buttons/ThemeButton";
import useIsClient from "@/hooks/useIsClient";
import Footer from "@/components/layout/Footer";

const poppins = Poppins({ weight: "400", subsets: ["latin"] });


export default function RootLayout({ children }) {
  const [isClient] = useIsClient();

  return (
    <html lang="en">
      <head>
        <title>Ecommerce Next.js</title>
      </head>
      <body className={poppins.className}>
        {isClient && (
          <Providers>
            <main className="text-foreground bg-background">
              <Nav />
              {children}
              {/* <ThemeButton /> */}
              <Footer />
            </main>
          </Providers>
        )}
      </body>
    </html>
  );
}
