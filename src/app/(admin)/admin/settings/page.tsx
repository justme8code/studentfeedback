"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, Bell, Palette, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [selectedUITheme, setSelectedUITheme] = useState("system"); // Default to system initially for UI
    const [mounted, setMounted] = useState(false); // State to track if component has mounted

    // Mock states for other settings
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(false);
    const [twoFactorAuth, setTwoFactorAuth] = useState(false);

    // Effect to set mounted state to true after initial render
    useEffect(() => {
        setMounted(true);
    }, []);

    // Effect to sync selectedUITheme with the actual theme once mounted
    useEffect(() => {
        if (mounted && theme) { // theme can be undefined initially
            setSelectedUITheme(theme);
        }
    }, [mounted, theme]);

    const handleThemeChange = (value: string) => {
        setSelectedUITheme(value);
        setTheme(value);
    };

    // If not mounted yet, render null or a loading state to avoid hydration mismatch
    if (!mounted) {
        // You can return a loading skeleton here if you prefer
        return null;
        // Or a minimal version of the page without theme-dependent text:
        // return (
        //   <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-3xl space-y-8">
        //     <Card><CardHeader><CardTitle>Loading Settings...</CardTitle></CardHeader></Card>
        //   </div>
        // );
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-3xl space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center">
                        <SettingsIcon className="mr-3 h-8 w-8 text-primary" />
                        Application Settings
                    </CardTitle>
                    <CardDescription>
                        Manage your application preferences and notification settings.
                        {/* This text is now safe because it only renders after mount */}
                        <span className="block mt-1 text-xs text-muted-foreground">
              Current theme: {resolvedTheme} (Selected: {selectedUITheme})
            </span>
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* ... (Notification Settings Card) ... */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-semibold flex items-center">
                        <Bell className="mr-2 h-5 w-5" /> Notification Settings
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
                        <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                            <span>Email Notifications</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                Receive updates and alerts via email.
              </span>
                        </Label>
                        <Switch
                            id="email-notifications"
                            checked={emailNotifications}
                            onCheckedChange={setEmailNotifications}
                        />
                    </div>
                    <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
                        <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
                            <span>Push Notifications</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                Get real-time alerts in your browser or app (if applicable).
              </span>
                        </Label>
                        <Switch
                            id="push-notifications"
                            disabled
                            checked={pushNotifications}
                            onCheckedChange={setPushNotifications}
                        />
                    </div>
                </CardContent>
            </Card>

            <Separator />

            {/* Appearance Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-semibold flex items-center">
                        <Palette className="mr-2 h-5 w-5" /> Appearance
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
                        <Label htmlFor="theme-select" className="flex flex-col space-y-1">
                            <span>Theme</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                    Choose your preferred application theme.
                </span>
                        </Label>
                        {/* The Select component should also ideally only render its value after mount if it depends on theme */}
                        <Select value={selectedUITheme} onValueChange={handleThemeChange}>
                            <SelectTrigger id="theme-select" className="w-[180px]">
                                {/* Placeholder might be different on server vs client if theme is "system" */}
                                <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System Default</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Separator />

            {/* ... (Security Settings Card) ... */}
           {/* <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-semibold flex items-center">
                        <ShieldCheck className="mr-2 h-5 w-5" /> Security
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
                        <Label htmlFor="2fa-auth" className="flex flex-col space-y-1">
                            <span>Two-Factor Authentication (2FA)</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                        Enhance your account security.
                    </span>
                        </Label>
                        <Switch
                            id="2fa-auth"
                            checked={twoFactorAuth}
                            onCheckedChange={setTwoFactorAuth}
                        />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        More security settings like connected devices, password policies, etc., would go here.
                    </p>
                </CardContent>
            </Card>*/}

            <Separator />


        </div>
    );
}