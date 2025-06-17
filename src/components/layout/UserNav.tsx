"use client";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings, LifeBuoy } from "lucide-react";
import Link from "next/link";
import { logout } from "@/lib/api/calls/auth";
import {useLoadingStore} from "@/lib/hooks/use-loading-store";
import {useToast} from "@/lib/hooks/use-toast-store"; // For logout
import { useUserStore } from "@/lib/hooks/useUserStore";

export function UserNav() {
    const { show, hide } = useLoadingStore();
    const { showSuccessToast, showErrorToast } = useToast();
    const {user,clearUser} = useUserStore();
    // Helper for initials
    const getInitials = (name?: string) => {
        if (!name) return "U";
        const parts = name.split(" ");
        return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
    };

    const handleLogout = async () => {
        show("Logging you out..."); // Show the full-page loader

        try {
            await logout();
            showSuccessToast("You have been logged out successfully.");
        } catch (error) {
            console.error("Logout failed:", error);
            showErrorToast("Failed to log out. Please try again.");
        } finally {
            hide();
        }
    };

    // Helper to get the correct route prefix based on user role
    const getRoutePrefix = () => {
        if (!user) return "";
        if (user.role_id === 1) return "/admin";
        if (user.role_id === 2 || user.role_id === 3) return "";
        return "";
    };
    const routePrefix = getRoutePrefix();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                        {/* You can add user.avatarUrl if you have it */}
                        <AvatarImage src={undefined} alt={`@${user?.full_name || "User"}`} />
                        <AvatarFallback>{getInitials(user?.full_name)}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.full_name || "User"}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user?.email || "No email"}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <Link href={`${routePrefix}/profiles`} passHref legacyBehavior>
                        <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                    </Link>
                    <Link href={`${routePrefix}/settings`} passHref legacyBehavior>
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <Link href="/support" passHref legacyBehavior>
                    <DropdownMenuItem>
                        <LifeBuoy className="mr-2 h-4 w-4" />
                        <span>Support</span>
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                {/* 5. The onClick prop now points to our new async handler */}
                <DropdownMenuItem onClick={() => {
                    clearUser();
                    handleLogout();
                }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}