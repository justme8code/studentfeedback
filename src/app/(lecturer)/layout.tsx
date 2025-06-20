"use client";

import { AdminSideNav } from "@/components/layout/AdminSideNav";
import { UserNav } from "@/components/layout/UserNav";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import {LecturerSideNav} from "@/components/layout/LecturerSideNav";
import {useRoleRedirect} from "@/lib/hooks/useRoleRedirect";
import {Logo} from "@/components/Logo";

export default function LecturerLayout({ children }: { children: React.ReactNode }) {


    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar for admin - visible on md+ */}
            <aside className="fixed inset-y-0 left-0 z-30 w-64 flex-col border-r bg-card hidden md:flex">
                <div className="flex h-16 items-center border-b px-6">
                    <Logo/>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    <LecturerSideNav/>
                </div>
            </aside>
            {/* Mobile nav trigger and drawer */}
            <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                <SheetTrigger asChild>
                    <button className="md:hidden absolute top-4 left-4 z-40 rounded-full p-2 bg-white dark:bg-neutral-900 shadow-lg border border-gray-200 dark:border-neutral-800 transition-colors duration-200" aria-label="Open admin menu">
                        <Menu className="w-6 h-6 text-primary dark:text-white" />
                    </button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                    <div className={"flex gap-2"}>
                        <Logo/>
                    </div>
                    <div className="p-4">
                        <LecturerSideNav />
                    </div>
                </SheetContent>
            </Sheet>
            {/* Main content area */}
            <div className="md:pl-64 flex flex-col min-h-screen">
                <header className="h-16 border-b flex items-center justify-end px-6 bg-background">
                    <UserNav />
                </header>
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
