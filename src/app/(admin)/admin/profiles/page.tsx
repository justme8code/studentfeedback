"use client";

import { UserProfile } from "@/components/profile/UserProfile";
import { useUserStore } from "@/lib/hooks/useUserStore";

export default function ProfilePage() {
    const user = useUserStore((state) => state.user);
    if (!user) return <div>Loading...</div>;
    return <UserProfile user={user} />;
}