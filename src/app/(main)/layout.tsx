"use client";

import {AppLayout} from "@/components/layout/AppLayout";
import {useRoleRedirect} from "@/lib/hooks/useRoleRedirect";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    useRoleRedirect();
    return (
        <AppLayout>
            {children}
        </AppLayout>
    );
}
