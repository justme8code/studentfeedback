"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
	LayoutDashboard,
	Users,
	BookMarked,
	Building2,
	MessageSquareText,
	Settings,
	Timer,
	NotebookPen
} from "lucide-react";

const adminNavItems = [
	{
		href: "/admin",
		label: "Dashboard",
		icon: <LayoutDashboard className="h-5 w-5" />,
	},
	{
		href: "/admin/courses",
		label: "Courses",
		icon: <NotebookPen />,
	},
	{
		href: "/admin/faculties",
		label: "Faculties",
		icon: <Building2 className="h-5 w-5" />,
	},
	{
		href: "/admin/departments",
		label: "Departments",
		icon: <BookMarked className="h-5 w-5" />,
	},
	{
		href: "/admin/lecturers",
		label: "Lecturers",
		icon: <Users className="h-5 w-5" />,
	},

	{
		href: "/admin/sessions",
		label: "Sessions",
		icon: <Timer className="h-5 w-5" />,
	},

	{
		href: "/admin/view-feedback",
		label: "View Feedback",
		icon: <MessageSquareText className="h-5 w-5" />,
	},
	{
		href: "/admin/settings",
		label: "Settings",
		icon: <Settings className="h-5 w-5" />,
	},
];

export function AdminSideNav({ className }: { className?: string }) {
	const pathname = usePathname();
	return (
		<nav
			className={cn(
				"flex flex-col gap-2 py-4 px-2 bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-800",
				className
			)}
		>
			{adminNavItems.map((item) => (
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
