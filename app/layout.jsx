"use client";

import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import Nav from "@/components/layout/Nav";
import ThemeButton from "@/components/buttons/ThemeButton";
import useIsClient from "@/hooks/useIsClient";
import Footer from "@/components/layout/Footer";
import Modals from "@/components/modals/Modals";
import { useEffect } from "react";

const poppins = Poppins({ weight: "400", subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [isClient] = useIsClient();

  useEffect(() => {
    const handleContextMenu = (e) => {
      if (e.target.tagName === "IMG") {
        e.preventDefault();
      }
    };
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Ecommerce Next.js</title>
      </head>
      <body className={poppins.className}>
        {isClient && (
          <Providers>
            <main className="text-foreground bg-background">
              <div className="min-h-[calc(100vh)]">
                <Nav />
                {children}
                <ThemeButton />
              </div>
              <Footer />
              <Modals />
            </main>
          </Providers>
        )}
      </body>
    </html>
  );
}
