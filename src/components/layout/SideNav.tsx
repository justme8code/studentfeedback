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
        href: "/courses",
        label: "Courses",
        icon: <BookMarked className="h-5 w-5" />,
    },
    {
        href: "/my-feedback",
        label: "My Feedback",
        icon: <MessageSquareText className="h-5 w-5" />,
    },
    // You can add more sections like Profile/Settings directly here if desired
    // Or keep them in UserNav dropdown for a cleaner sidebar
    {
        href: "/profile", // Assuming a profile page
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
                "flex flex-col space-y-2", // Basic vertical stacking
                className
            )}
            {...props}
        >
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    onClick={onLinkClick} // Call if mobile and link is clicked
                    className={cn(
                        buttonVariants({ variant: "ghost" }), // Use button styles for consistency
                        "w-full justify-start text-base h-11", // Custom height and text size
                        pathname === item.href
                            ? "bg-primary/10 text-primary hover:bg-primary/20" // Active link style
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                >
                    {item.icon && <span className="mr-3">{item.icon}</span>}
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}