"use client";
import { useState } from "react";
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
import {
    ChangePasswordFormData,
    changePasswordFormSchema,
    UpdateProfileFormData,
    updateProfileFormSchema
} from "@/lib/schema";
import type { User } from "@/lib/types/user";

export function UserProfile({ user }: { user: User }) {
    const [isEditingName, setIsEditingName] = useState(false);
    const [profileUpdateMessage, setProfileUpdateMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
    const [passwordChangeMessage, setPasswordChangeMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

    // Form for updating profiles (e.g., name)
    const profileForm = useForm<UpdateProfileFormData>({
        resolver: zodResolver(updateProfileFormSchema),
        defaultValues: {
            fullName: user.full_name,
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

    // Helper for initials
    const getInitials = (name?: string) => {
        if (!name) return "U";
        const parts = name.split(" ");
        return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
    };

    // TODO: Implement update profile and change password logic
    // For now, just show a message
    const onProfileSubmit = (data: UpdateProfileFormData) => {
        setProfileUpdateMessage({ type: "success", text: "Profile updated (mock)!" });
        setIsEditingName(false);
    };
    const onPasswordSubmit = (data: ChangePasswordFormData) => {
        setPasswordChangeMessage({ type: "success", text: "Password changed (mock)!" });
        passwordForm.reset();
    };

    return (
        <div className="max-w-xl mx-auto">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={undefined} alt={user.full_name} />
                            <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                {user.full_name}
                                <Button size="icon" variant="ghost" onClick={() => setIsEditingName(true)}>
                                    <Edit className="w-4 h-4" />
                                </Button>
                            </CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Profile Info */}
                    <Separator className="my-4" />
                    <div className="mb-4">
                        <div className="font-semibold mb-1">Role:</div>
                        <div className="capitalize">{user.role_id === 1 ? "Admin" : user.role_id === 2 ? "Lecturer" : "Student"}</div>
                    </div>
                    {/* Student or Lecturer profile info */}
                    {user.profile && "matric_number" in user.profile && (
                        <div className="mb-4">
                            <div className="font-semibold mb-1">Matric Number:</div>
                            <div>{user.profile.matric_number}</div>
                            <div className="font-semibold mb-1 mt-2">Level:</div>
                            <div>{user.profile.level}</div>
                        </div>
                    )}
                    {user.profile && "department_id" in user.profile && (
                        <div className="mb-4">
                            <div className="font-semibold mb-1">Department ID:</div>
                            <div>{user.profile.department_id}</div>
                            <div className="font-semibold mb-1 mt-2">Faculty ID:</div>
                            <div>{user.profile.faculty_id}</div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Name Form */}
            {isEditingName && (
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Edit Name</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...profileForm}>
                            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                                <FormField
                                    control={profileForm.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">Save</Button>
                                <Button type="button" variant="outline" onClick={() => setIsEditingName(false)}>Cancel</Button>
                            </form>
                        </Form>
                        {profileUpdateMessage && (
                            <div className={`mt-2 text-${profileUpdateMessage.type === 'success' ? 'green' : 'red'}-600`}>{profileUpdateMessage.text}</div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Change Password Form */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                            <FormField
                                control={passwordForm.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Current Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
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
                                            <Input type="password" {...field} />
                                        </FormControl>
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
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Change Password</Button>
                        </form>
                    </Form>
                    {passwordChangeMessage && (
                        <div className={`mt-2 text-${passwordChangeMessage.type === 'success' ? 'green' : 'red'}-600`}>{passwordChangeMessage.text}</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

