"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      {children}
      <Toaster
        toastOptions={{
          classNames: {
            toast:
              "bg-slate-900 border border-slate-800 text-slate-100 shadow-xl",
            description: "text-slate-400"
          }
        }}
      />
    </ThemeProvider>
  );
}
