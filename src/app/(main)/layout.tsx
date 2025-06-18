"use client";

import {AppLayout} from "@/components/layout/AppLayout";

export default function MainLayout({ children }: { children: React.ReactNode }) {
 
    return (
        <AppLayout>
            {children}
        </AppLayout>
    );
}
