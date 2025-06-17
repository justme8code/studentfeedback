  "use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation"; // 1. Import useRouter for redirection

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
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
import { signUpFormSchema } from "@/lib/schema";
import { signUp } from "@/lib/api/calls/auth";
import {useLoadingStore} from "@/lib/hooks/use-loading-store";
import {useToast} from "@/lib/hooks/use-toast-store";
import {saveUserAcademicInfo} from "@/lib/api/calls/acadamics";
import {useState} from "react";
import {AcademicInfoModal} from "@/components/modals/acadamic-info-modal";
  import {useUserStore} from "@/lib/hooks/useUserStore";
// Note: The FullPageLoader is now in the layout, so we don't need to import or render it here.

export function SignUpPage() {
    const { show, hide } = useLoadingStore();
    const router = useRouter();
    // 2. Initialize the hook to get your helper functions
    const { showSuccessToast, showErrorToast } = useToast();
    const [isAcademicModalOpen, setIsAcademicModalOpen] = useState(false);
    const { setUser } = useUserStore();


    const form = useForm<z.infer<typeof signUpFormSchema>>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });


    // 5. Create a save handler to pass to the modal
    const handleSaveAcademicInfo = async (data: { facultyId: string; departmentId: string }) => {
        show("Saving your information...");
        try {
            const { success, message } = await saveUserAcademicInfo(data);
            if (success) {
                showSuccessToast(message || "Information saved!");
                setIsAcademicModalOpen(false); // Close the modal
                router.push("/dashboard"); // Finally, redirect
            } else {
                showErrorToast(message || "Could not save information.");
            }
        } catch (error) {
            console.error("Save academic info error:", error);
            showErrorToast("An unexpected error occurred.");
        } finally {
            hide();
        }
    };


    async function onSubmit(values: z.infer<typeof signUpFormSchema>) {
        show("Creating your account...");

        try {
            // Assume signUp now returns: { status: boolean, message: string, new_user: boolean }
            const {user, status, message, new_user } = await signUp(values);

            if (status) {
                if (new_user) {
                   if (user.role_id === 2) {
                       // NEW USER: Open the modal instead of redirecting
                       setUser(user);
                       hide(); // Hide the full page loader
                       showSuccessToast(message || "Account created! Please complete your profile.");
                       setIsAcademicModalOpen(true); // Open the modal
                   }
                } else {
                    // RETURNING USER (already verified, etc.)
                    showSuccessToast(message || "Welcome back!");
                    router.push("/dashboard");
                }
            } else {
                showErrorToast(message || "Sign-up failed. Please try again.");
            }
        } catch (error) {
            console.error("Sign-up error:", error);
            showErrorToast("An unexpected error occurred. Please try again later.");
        } finally {
            // We only hide the loader if the modal isn't about to open
            if (!isAcademicModalOpen) {
                hide();
            }
        }
    }

    return (
        // The FullPageLoader is now managed globally by the layout, so we remove it from here.
        <div className="flex min-h-screen items-center justify-center bg-background p-4">


            <AcademicInfoModal
                isOpen={isAcademicModalOpen}
                onClose={() => setIsAcademicModalOpen(false)}
                onSave={handleSaveAcademicInfo}
            />


            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
                    <CardDescription>
                        Enter your details below to create your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        {/* We add form.formState.isSubmitting to disable the button while processing */}
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="m@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                Sign Up
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col items-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <a href="/auth" className="font-medium text-primary hover:underline">
                            Login
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}