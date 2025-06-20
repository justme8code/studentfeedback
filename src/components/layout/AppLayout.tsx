"use client"; // Add "use client" if using hooks like useState for mobile menu

import { useState } from "react";
import { UserNav } from "./UserNav";
import { SideNav } from "./SideNav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // For mobile
import { Menu, XSquare } from "lucide-react"; // Icons for mobile menu
import Link from "next/link";
import {Logo} from "@/components/Logo";

interface AppLayoutProps {
    children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar - visible on md and larger screens */}
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-card md:flex">
                <div className="flex h-16 items-center border-b px-6">
                    {/* App Logo/Name for Sidebar Header */}
                    <Link href="/dashboard" className="text-xl font-bold tracking-tight text-primary">
                        <Logo/>
                    </Link>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    <SideNav />
                </div>
                {/* Optional: Footer or user info at bottom of sidebar */}
                {/* <div className="mt-auto p-4 border-t">
          <p className="text-xs text-muted-foreground">User Info / Quick Actions</p>
        </div> */}
            </aside><aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-card md:flex">
                <div className="flex h-16 items-center border-b px-6">
                    {/* App Logo/Name for Sidebar Header */}
                    <Link href="/dashboard" className="text-xl font-bold tracking-tight text-primary">
                        <Logo/>
                    </Link>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    <SideNav />
                </div>
                {/* Optional: Footer or user info at bottom of sidebar */}
                {/* <div className="mt-auto p-4 border-t">
          <p className="text-xs text-muted-foreground">User Info / Quick Actions</p>
        </div> */}
            </aside>

            {/* Main Content Area - pushed to the right on md and larger screens */}
            <div className="flex flex-col md:pl-64"> {/* pl-64 matches sidebar width */}
                {/* Header for Main Content Area */}
                <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6">
                    {/* Mobile Nav Trigger - visible on screens smaller than md */}
                    <div className="md:hidden">
                        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                            <SheetTrigger asChild>
                                <button className="md:hidden absolute top-4 left-4 z-40 rounded-full p-2 bg-white dark:bg-neutral-900 shadow-lg border border-gray-200 dark:border-neutral-800 transition-colors duration-200" aria-label="Open menu">
                                    <Menu className="w-6 h-6 text-primary dark:text-white" />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-64">
                                <div className="h-16 flex items-center border-b px-6 font-bold text-xl text-primary">CFMS</div>
                                <div className="p-4">
                                    <SideNav />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* App Name for small screens when sidebar is hidden, or empty space */}
                    <div className="flex items-center md:hidden">
                        <Link href="/dashboard" className="ml-4 text-lg font-bold tracking-tight text-primary md:hidden">
                            SF System
                        </Link>
                    </div>
                    <div className="flex-1 md:flex-grow-0"> {/* Pushes UserNav to the right */}
                        {/* Can add breadcrumbs or page title here if needed */}
                    </div>


                    {/* UserNav always in the header */}
                    <div className="ml-auto flex items-center space-x-4">
                        <UserNav />
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>

                {/* Optional: Footer for the main content area */}
                {/* <footer className="border-t p-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Student Feedback System.
        </footer> */}
            </div>
        </div>
    );
}