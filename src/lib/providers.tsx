// In: app/providers.tsx (or lib/providers.tsx)
"use client"; // This is a client component

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // Optional but recommended
import { ThemeProvider } from "next-themes";
import { AppLayout } from "@/components/layout/AppLayout";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
    // Use useState to ensure the QueryClient is only created once per component instance
    // This is safe for both server and client rendering
    const [queryClient] = useState(() => new QueryClient());

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>

        <Toaster richColors position="top-right" />
            {children}

        <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
        </ThemeProvider>
);
}