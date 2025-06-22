"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
    LayoutDashboard,
    Settings,
    User,
} from "lucide-react";

// Define your navigation items for the sidebar
const navItems = [
    {
        href: "/dashboard",
        label: "Dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
    },

    /* {
         href: "/student-courses",
         label: "Courses",
         icon: <BookMarked className="h-5 w-5" />,
     },
     {
         href: "/my-feedbacks",
         label: "My Feedback",
         icon: <MessageSquareText className="h-5 w-5" />,
     },*/
    {
        href: "/profiles",
        label: "Profile",
        icon: <User className="h-5 w-5" />,
    },
    {
        href: "/settings",
        label: "Settings",
        icon: <Settings className="h-5 w-5" />,
    },
];

interface SideNavProps extends React.HTMLAttributes<HTMLElement> {
    isMobile?: boolean;
    onLinkClick?: () => void;
}

export function SideNav({ className, isMobile = false, onLinkClick, ...props }: SideNavProps) {
    const pathname = usePathname();

    return (
        // --- CHANGED ---
        // Removed card styles (bg, shadow, border, rounded-2xl)
        // This nav is now a simple flex container. The background
        // should be provided by its parent layout component.
        <nav
            className={cn("flex flex-col gap-1 p-2", className)}
            {...props}
        >
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    onClick={onLinkClick}
                    className={cn(
                        // --- CHANGED ---
                        // Using a more standard button look instead of a pill shape
                        // Replaced rounded-full with rounded-md and adjusted padding/height
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        pathname === item.href
                            // Active link: a subtle blue background with stronger blue text
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200"
                            // Inactive link: standard text color, with a subtle gray background and blue text on hover
                            : "text-gray-600 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-neutral-800 dark:hover:text-blue-400"
                    )}
                >
                    {/* The gap-3 on the parent Link handles spacing, so no margin is needed here */}
                    {item.icon}
                    <span>{item.label}</span>
                </Link>
            ))}
        </nav>
    );
}