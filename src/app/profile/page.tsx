"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { UserCircle, LockKeyhole, Edit } from "lucide-react";
import { useState } from "react";
import {
    ChangePasswordFormData,
    changePasswordFormSchema,
    UpdateProfileFormData,
    updateProfileFormSchema
} from "@/lib/schema"; // For managing edit state or feedback

// --- Mock User Data ---
// In a real app, this would come from user session/context
const initialUserData = {
    id: "user123",
    fullName: "Isabella Wonderland",
    email: "isa@example.com",
    avatarUrl: "https://github.com/shadcn.png",
    initials: "AW",
};
// --- End Mock Data ---

export default function ProfilePage() {
    // State for user data, could be fetched or from context
    const [userData, setUserData] = useState(initialUserData);
    const [isEditingName, setIsEditingName] = useState(false);
    const [profileUpdateMessage, setProfileUpdateMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
    const [passwordChangeMessage, setPasswordChangeMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);


    // Form for updating profile (e.g., name)
    const profileForm = useForm<UpdateProfileFormData>({
        resolver: zodResolver(updateProfileFormSchema),
        defaultValues: {
            fullName: userData.fullName,
        },
    });

    // Form for changing password
    const passwordForm = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordFormSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
    });

    // Handler for updating profile
    function onProfileSubmit(values: UpdateProfileFormData) {
        // Simulate API call
        console.log("Updating profile with:", values);
        setProfileUpdateMessage(null); // Clear previous message
        return new Promise(resolve => setTimeout(() => {
            setUserData(prev => ({ ...prev, fullName: values.fullName }));
            profileForm.reset({ fullName: values.fullName }); // Update defaultValues for next edit
            setIsEditingName(false);
            setProfileUpdateMessage({type: 'success', text: "Profile updated successfully!"});
            resolve(true);
        }, 1000));
    }

    // Handler for changing password
    function onPasswordSubmit(values: ChangePasswordFormData) {
        // Simulate API call
        console.log("Changing password with (current password hidden):", { newPassword: values.newPassword });
        setPasswordChangeMessage(null);
        return new Promise(resolve => setTimeout(() => {
            // Here you'd call your API. If successful:
            setPasswordChangeMessage({type: 'success', text: "Password changed successfully!"});
            passwordForm.reset();
            // If error (e.g. current password incorrect):
            // setPasswordChangeMessage({type: 'error', text: "Incorrect current password."});
            // passwordForm.setError("currentPassword", { type: "manual", message: "Incorrect current password." });
            resolve(true);
        }, 1000));
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center">
                        <UserCircle className="mr-3 h-8 w-8 text-primary" />
                        Your Profile
                    </CardTitle>
                    <CardDescription>
                        View and manage your personal information.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={userData.avatarUrl} alt={userData.fullName} />
                            <AvatarFallback>{userData.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-center sm:text-left">
                            {!isEditingName ? (
                                <div className="flex items-center justify-center sm:justify-start">
                                    <h2 className="text-xl font-semibold">{userData.fullName}</h2>
                                    <Button variant="ghost" size="icon" className="ml-2" onClick={() => {
                                        profileForm.setValue("fullName", userData.fullName); // Ensure form has latest value
                                        setIsEditingName(true);
                                        setProfileUpdateMessage(null);
                                    }}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <Form {...profileForm}>
                                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="flex items-end space-x-2">
                                        <FormField
                                            control={profileForm.control}
                                            name="fullName"
                                            render={({ field }) => (
                                                <FormItem className="flex-grow">
                                                    <FormLabel htmlFor="fullNameEdit">Full Name</FormLabel>
                                                    <FormControl>
                                                        <Input id="fullNameEdit" placeholder="Your full name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                                            {profileForm.formState.isSubmitting ? "Saving..." : "Save"}
                                        </Button>
                                        <Button type="button" variant="outline" onClick={() => setIsEditingName(false)}>Cancel</Button>
                                    </form>
                                </Form>
                            )}
                            <p className="text-sm text-muted-foreground">{userData.email}</p>
                            {profileUpdateMessage && (
                                <p className={`mt-2 text-sm ${profileUpdateMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                    {profileUpdateMessage.text}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Separator />

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-semibold flex items-center">
                        <LockKeyhole className="mr-3 h-6 w-6 text-primary" />
                        Change Password
                    </CardTitle>
                    <CardDescription>
                        Update your account password. Choose a strong and unique password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6 max-w-md">
                            <FormField
                                control={passwordForm.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Current Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={passwordForm.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Must be at least 8 characters long.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={passwordForm.control}
                                name="confirmNewPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                                {passwordForm.formState.isSubmitting ? "Changing..." : "Change Password"}
                            </Button>
                            {passwordChangeMessage && (
                                <p className={`mt-2 text-sm ${passwordChangeMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                    {passwordChangeMessage.text}
                                </p>
                            )}
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}