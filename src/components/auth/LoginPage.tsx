"use client"; // Required for client-side interactivity

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation"; // 1. Import for redirection

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
import { loginFormSchema } from "@/lib/schema";
import { login } from "@/lib/api/calls/auth";
import {useLoadingStore} from "@/lib/hooks/use-loading-store";
import {useToast} from "@/lib/hooks/use-toast-store";
import {useUserStore} from "@/lib/hooks/useUserStore";


export function LoginPage() {
    // 3. Initialize your hooks
    const router = useRouter();
    const { setUser } = useUserStore();
    const { show, hide } = useLoadingStore();
    const { showSuccessToast, showErrorToast } = useToast();

    const form = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // 4. Define the complete, async submit handler
    async function onSubmit(values: z.infer<typeof loginFormSchema>) {
        show("Logging you in..."); // Show the loader

        try {
            // Assume login API returns { status: boolean, message: string }
            const {user, status, error } = await login(values);

            if (status && user) {
                // SUCCESS
                setUser(user);
                showSuccessToast("Login successful! Welcome back.");
                if(user.role_id == 1){
                    router.push("/admin/departments"); // Redirect to the main app page
                }

                if(user.role_id == 2){
                    router.push("/dashboard"); // Redirect to the main app page
                }



            } else {
                // FAILURE (e.g., wrong password, user not found)
                showErrorToast(error.message || "Invalid credentials. Please try again.");
            }
        } catch (error) {
            // UNEXPECTED ERROR (e.g., network issue, server down)
            console.error("Login error:", error);
            showErrorToast("An unexpected error occurred. Please try again later.");
        } finally {
            // 5. ALWAYS hide the loader when the process is finished
            hide();
        }
    }

    return (
        // The FullPageLoader is managed globally by the layout, so we don't need it here.
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        {/* 6. Point the form's onSubmit to our new async handler */}
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                            {/* 7. Disable the button while the form is submitting to prevent double-clicks */}
                            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                Login
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col items-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                        {"Don't have an account?"}{" "}
                        {/* Corrected link to be absolute */}
                        <a href="/auth/sign-up" className="font-medium text-primary hover:underline">
                            Sign Up
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}