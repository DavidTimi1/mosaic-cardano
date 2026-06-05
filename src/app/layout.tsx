import "../styles/globals.css";

import type { ReactNode } from 'react';
import FilmGrain from '../components/FilmGrain';
import { Figtree } from "next/font/google";
import { cn } from "@/lib/utils";
import QueryProvider from "@/contexts/query-provider";
import NextTopLoader from "nextjs-toploader";
import { AuthProvider } from "@/contexts/auth-context";
import { ModalsProvider } from "@/contexts/modals-context";
import { ModalsContainer } from "@/components/layout/ModalsContainer";

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' });


export const metadata = {
  title: 'mosaic',
  description: 'Mosaic Cardano - Modular Next.js App'
};


import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", figtree.variable)}>
      <body>
        <QueryProvider>
          <AuthProvider>
            <ModalsProvider>
              <NextTopLoader color="var(--color-theme-accent)" />
              <div className="min-h-screen bg-[#FFFBF5] relative selection:bg-amber-200/50">
                <FilmGrain />
                {children}
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#4338CA]/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
              </div>
              <ModalsContainer />
            </ModalsProvider>
          </AuthProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
