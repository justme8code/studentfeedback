"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Home,
    BookMarked,
    MessageSquareText,
    Settings,
    User,
    LayoutDashboard // A more generic icon for Dashboard if preferred
} from "lucide-react";

// Define your navigation items for the sidebar
const navItems = [
    {
        href: "/dashboard",
        label: "Dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
        href: "/student-courses",
        label: "Courses",
        icon: <BookMarked className="h-5 w-5" />,
    },
    {
        href: "/my-feedbacks",
        label: "My Feedback",
        icon: <MessageSquareText className="h-5 w-5" />,
    },
    // You can add more sections like Profile/Settings directly here if desired
    // Or keep them in UserNav dropdown for a cleaner sidebar
    {
        href: "/profiles", // Assuming a profiles page
        label: "Profile",
        icon: <User className="h-5 w-5" />,
    },
    {
        href: "/settings", // Assuming a settings page
        label: "Settings",
        icon: <Settings className="h-5 w-5" />,
    },
];

interface SideNavProps extends React.HTMLAttributes<HTMLElement> {
    // Add any specific props if needed, e.g., for mobile state
    isMobile?: boolean;
    onLinkClick?: () => void; // For closing mobile nav on link click
}

export function SideNav({ className, isMobile = false, onLinkClick, ...props }: SideNavProps) {
    const pathname = usePathname();

    return (
        <nav
            className={cn(
                "flex flex-col gap-2 py-4 px-2 bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-800", // Material/Google style with dark mode
                className
            )}
            {...props}
        >
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    onClick={onLinkClick}
                    className={cn(
                        buttonVariants({ variant: pathname === item.href ? "default" : "ghost", size: "lg" }),
                        "w-full justify-start text-base h-12 rounded-full transition-all duration-150 flex items-center gap-3",
                        pathname === item.href
                            ? "bg-blue-600 text-white shadow-md hover:bg-blue-700 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600"
                            : "text-gray-700 hover:bg-gray-100 hover:text-blue-700 dark:text-gray-200 dark:hover:bg-neutral-800 dark:hover:text-blue-400"
                    )}
                >
                    {item.icon && <span className="mr-3">{item.icon}</span>}
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}