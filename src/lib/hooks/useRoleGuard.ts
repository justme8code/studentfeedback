// lib/hooks/useRoleGuard.ts (you can rename your file)

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore, getUserRole } from "@/lib/hooks/useUserStore";

type Role = "admin" | "student" | null;

/**
 * A hook to protect a page, ensuring the user has the required role.
 * It handles the loading state during hydration and performs redirects.
 *
 * @param requiredRole The role required to access the page.
 * @returns {boolean} isLoading - True while checking auth, false when ready.
 */
export function useRoleGuard(requiredRole: Role) {
    const router = useRouter();
    const pathname = usePathname();
    const user = useUserStore((state) => state.user);
    const hasHydrated = useUserStore.persist?.hasHydrated?.() ?? true;

    // Start in a loading state until we can verify the user
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Wait until the store is rehydrated
        if (!hasHydrated) {
            return;
        }

        // 1. Check for a logged-in user
        if (!user) {
            // If no user, redirect to auth page
            router.replace("/auth");
            // No need to setIsLoading(false) because we are navigating away
            return;
        }

        const userRole = getUserRole(user);

        // 2. Check if the user's role matches the required role for the page
        if (userRole === requiredRole) {
            // User has the correct role. It's safe to show the page.
            setIsLoading(false);
        } else {
            // 3. If roles don't match, redirect to their default page
            if (userRole === "admin") {
                router.replace("/admin");
            } else if (userRole === "student") {
                router.replace("/main");
            } else {
                // Fallback for unknown roles
                router.replace("/auth");
            }
        }
    }, [user, hasHydrated, requiredRole, router]);

    return isLoading;
}