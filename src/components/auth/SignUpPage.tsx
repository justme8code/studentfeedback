"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { studentFormSchema } from "@/lib/schema";
import { signUp } from "@/lib/api/calls/auth";
import { useLoadingStore } from "@/lib/hooks/use-loading-store";
import React, { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { getFacultiesWithDepartments } from "@/lib/api/calls/faculty";
import { Department, Faculty } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import {useToast} from "@/lib/hooks/use-toast-store";

const academicLevels = [100, 200, 300, 400, 500, 600];

export function SignUpPage() {
    // --- STATE MANAGEMENT (Simplified) ---
    const { show, hide } = useLoadingStore();
    const router = useRouter();

    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [formError, setFormError] = useState<string | null>(null);
    const {showErrorToast,showSuccessToast} = useToast();
    // REMOVED: All state related to steps is gone.

    // --- FORM SETUP ---
    const form = useForm<z.infer<typeof studentFormSchema>>({
        resolver: zodResolver(studentFormSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            facultyId: "",
            departmentId: "",
            matricNumber: "",
            level: undefined,
        },
    });

    const { watch, resetField } = form;
    const watchedFacultyId = watch("facultyId");

    useEffect(() => {
        const fetchFaculties = async () => {
            try {
                const { data } = await getFacultiesWithDepartments();
                if (data) {
                    setFaculties(data);
                } else {
                    setFormError("Could not load academic data. Please refresh the page.");
                }
            } catch (error) {
                console.error("Error fetching faculties:", error);
                setFormError("Could not load academic data. Please refresh the page.");
            }
        };
        fetchFaculties();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    useEffect(() => {
        if (watchedFacultyId) {
            const selectedFaculty = faculties.find(f => String(f.id) === watchedFacultyId);
            setDepartments(selectedFaculty?.departments || []);
        } else {
            setDepartments([]);
        }
    }, [watchedFacultyId, faculties]);

    // --- FORM SUBMISSION (Correct and Stable) ---
    async function onSubmit(values: z.infer<typeof studentFormSchema>) {
        show("Creating your account...");
        setFormError(null);

        const apiPayload = {
            full_name: values.fullName,
            email: values.email,
            password: values.password,
            department_id: parseInt(values.departmentId, 10),
            faculty_id: parseInt(values.facultyId, 10),
            matric_number: values.matricNumber,
            level: values.level,
        };
        try {
            const { status,error } = await signUp(apiPayload);
            if (status) {

                showSuccessToast("Account created successfully! Please log in.");
                router.push("/auth");
            } else {
                showErrorToast(error || "Sign-up failed. Please check your details and try again.")

            }
        } catch (error) {
            console.error("Sign-up error:", error);
            setFormError("An unexpected error occurred. Please try again later.");
        } finally {
            hide();
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center  p-4">


            {/* Increased max-width for the two-column layout */}
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <img
                        src="https://www.calebuniversity.edu.ng/caleb_uploads/2024/03/cropped-caleb-logoooonnnttt-180x180.png"
                        alt="Caleb Logo"
                        className="w-24 h-24 rounded-full bg-white p-2 mb-6"
                    />
                    <CardTitle className="text-2xl font-bold">Create a Student Account</CardTitle>
                    <CardDescription>Please fill in your details below to get started.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            {/* NEW: Grid container for the two-column layout */}
                            <div className="flex flex-col space-y-5">

                                {/* --- LEFT COLUMN: ACCOUNT DETAILS --- */}
                                <div className=" grid grid-cols-1  gap-2 gap-y-4 md:grid-cols-2">
                                    <FormField control={form.control} name="fullName" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem> )} />
                                    <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="m@example.com" {...field} /></FormControl><FormMessage /></FormItem> )} />
                                    <FormField control={form.control} name="password" render={({ field }) => ( <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem> )} />
                                    <FormField control={form.control} name="confirmPassword" render={({ field }) => ( <FormItem><FormLabel>Confirm Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem> )} />
                                </div>

                                {/* --- RIGHT COLUMN: ACADEMIC DETAILS --- */}
                                <div className=" grid grid-cols-1 gap-2 gap-y-4 md:grid-cols-1">
                                    <FormField control={form.control} name="facultyId" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Faculty</FormLabel>
                                            <Select value={field.value} onValueChange={(value) => { field.onChange(value); resetField("departmentId"); }}><FormControl  className={"rounded-full w-full py-6"}><SelectTrigger><SelectValue placeholder="Select a faculty" /></SelectTrigger></FormControl><SelectContent>{faculties?.map((faculty) => (<SelectItem key={faculty.id} value={String(faculty.id)}>{faculty.name}</SelectItem>))}</SelectContent></Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="departmentId" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Department</FormLabel>
                                            <Select value={field.value} onValueChange={field.onChange} disabled={!watchedFacultyId || departments.length === 0}><FormControl  className={"rounded-full w-full py-6"}><SelectTrigger><SelectValue placeholder="Select a department" /></SelectTrigger></FormControl><SelectContent>{departments?.map((dept) => (<SelectItem key={dept.id} value={String(dept.id)}>{dept.name}</SelectItem>))}</SelectContent></Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField control={form.control} name="level" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Level</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value?.toString()}><FormControl className={"rounded-full w-full py-6"}><SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger></FormControl><SelectContent>{academicLevels.map((level) => (<SelectItem key={level} value={String(level)}>{level}</SelectItem>))}</SelectContent></Select>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="matricNumber" render={({ field }) => ( <FormItem><FormLabel>Matric No.</FormLabel><FormControl><Input placeholder="U/21/CS/001" {...field} /></FormControl><FormMessage /></FormItem> )} />
                                    </div>
                                </div>
                            </div>

                            {/* --- ERROR ALERT & SUBMIT BUTTON --- */}
                            {formError && (
                                <Alert variant="destructive" className="mt-6">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Registration Error</AlertTitle>
                                    <AlertDescription>{formError}</AlertDescription>
                                </Alert>
                            )}
                            <div className={"flex justify-center"}>
                                <Button type="submit" className=" !mt-8" disabled={form.formState.isSubmitting}>
                                    Create Account
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <p className="w-full text-center text-sm text-muted-foreground">
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