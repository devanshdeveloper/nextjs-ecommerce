"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./AuthProvider";

export default function Providers({ children }) {
  const queryClient = new QueryClient();
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
