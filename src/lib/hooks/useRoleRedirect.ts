import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation"; // Import usePathname
import { useUserStore, getUserRole } from "@/lib/hooks/useUserStore";

export function useRoleRedirect() {
  const router = useRouter();
  const pathname = usePathname(); // Get the current URL pathname
  const user = useUserStore((state) => state.user);
  const hasHydrated = useUserStore.persist?.hasHydrated?.() ?? true;

  useEffect(() => {
    // Wait for the store to be rehydrated from storage
    if (!hasHydrated) {
      return;
    }

    // --- Case 1: No user is logged in ---
    if (!user) {
      // Only redirect if we are NOT already on the auth page
      if (pathname !== "/auth") {
        router.replace("/auth");
      }
      return;
    }

    const role = getUserRole(user);

    // --- Case 2: User is an admin ---
    if (role === "admin") {
      // Only redirect if they are NOT already on an admin page
      if (!pathname.startsWith("/admin")) {
        router.replace("/admin");
      }
    }
    // --- Case 3: User is a student ---
    else if (role === "student") {
      // Only redirect if they are NOT already on a main page
      if (!pathname.startsWith("/main")) {
        router.replace("/main");
      }
    }
    else if (role === "lecturer") {
      // Only redirect if they are NOT already on a main page
      if (!pathname.startsWith("/lecturers")) {
        router.replace("/lecturers");
      }
    }
    // --- Case 4: Fallback for unknown roles ---
    else {
      // Redirect to auth page if they have an unrecognized role
      if (pathname !== "/auth") {
        router.replace("/auth");
      }
    }
  }, [user, pathname, router, hasHydrated]); // Add pathname to dependencies
}