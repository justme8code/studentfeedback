"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
    LayoutDashboard,
    Settings,
    NotebookPen,

    ClipboardList, MessageSquareText,
} from "lucide-react";

const lecturerNavItems = [
    {
        href: "/lecturers",
        label: "Dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
    },

    {
        href: "/lecturers/questionnaires",
        label: "Questionnaires",
        icon: <ClipboardList className="h-5 w-5" />,
    },


    {
        href: "/lecturers/settings",
        label: "Settings",
        icon: <Settings className="h-5 w-5" />,
    },
];

export function LecturerSideNav({ className }: { className?: string }) {
    const pathname = usePathname();
    return (
        <nav
            className={cn(
                "flex flex-col gap-2 py-4 px-2 bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-800",
                className
            )}
        >
            {lecturerNavItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        buttonVariants({
                            variant: pathname === item.href ? "default" : "ghost",
                            size: "lg",
                        }),
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