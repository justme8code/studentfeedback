"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Home, BookMarked, MessageSquareText } from "lucide-react"; // Icons

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: <Home className="h-4 w-4" /> },
    { href: "/student-courses", label: "Courses", icon: <BookMarked className="h-4 w-4" /> }, // Assuming a /student-courses page
    { href: "/my-feedbacks", label: "My Feedback", icon: <MessageSquareText className="h-4 w-4" /> }, // Assuming a /my-feedbacks page
];

export function MainNav({
                            className,
                            ...props
                        }: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname();

    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
            {...props}
        >
            <NavigationMenu>
                <NavigationMenuList>
                    {navItems.map((item) => (
                        <NavigationMenuItem key={item.href}>
                            <Link href={item.href} legacyBehavior passHref>
                                <NavigationMenuLink
                                    className={cn(
                                        navigationMenuTriggerStyle(),
                                        pathname === item.href
                                            ? "bg-accent text-accent-foreground"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    {item.icon && <span className="mr-2">{item.icon}</span>}
                                    {item.label}
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>
        </nav>
    );
}