// /app/admin/create-questionnaire/components/questionnaire-details-form.tsx

"use client";

import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"; // Input is already imported
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuestionnaireBuilderData } from "@/lib/schema";
import {useEffect, useState} from "react";
import {getAllCourseOfferingsByLecturerId} from "@/lib/api/calls/course-offerings";
import {useUserStore} from "@/lib/hooks/useUserStore";
import {Course} from "@/lib/types";

interface QuestionnaireDetailsFormProps {
    form: UseFormReturn<QuestionnaireBuilderData>;
}

export function QuestionnaireDetailsForm({ form }: QuestionnaireDetailsFormProps) {
    const {user} = useUserStore();
    const [courses,setCourses] = useState<Course[]>([]);

    useEffect(() => {
         const fetchCourses = async () => {
            if (user && user.id) {
                const result = await getAllCourseOfferingsByLecturerId(user.id.toString());
                if (result.data) {
                    const s:Course[] = result.data.map(value => {
                        return value.course
                    });
                    setCourses(s)
                } else {
                    console.error("Failed to fetch course offerings:", result.error);
                }
            }
         }

         fetchCourses();
    },[user]);
    return (
        <>
            <FormField control={form.control} name="title" render={({ field }) => ( <FormItem><FormLabel>Questionnaire Title</FormLabel><FormControl><Input placeholder="e.g., End of Semester Feedback" {...field} /></FormControl><FormMessage /></FormItem> )} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <FormField control={form.control} name="course_offering_id"  render={({ field }) => (
                    <FormItem> <FormLabel>Course Offering</FormLabel> <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl className={"rounded-full py-6 "}><SelectTrigger><SelectValue placeholder="Select a course..." /></SelectTrigger>

                </FormControl><SelectContent>{courses.map(c =>
                    <SelectItem key={c.id} value={c.id.toString()}>{c.course_title}-{c.course_code}</SelectItem>)}
                </SelectContent> </Select><FormMessage /> </FormItem> )} />


                <FormField
                    control={form.control}
                    name="feedback_round"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Feedback Round</FormLabel>
                            <FormControl className={"rounded-full py-6"}>
                                <Input
                                    type="number"
                                    placeholder="e.g., 1"
                                    {...field}
                                    // This is the key: The input's value must be a string.
                                    // We convert the form's number/undefined value to a string for display.
                                    // When the user types, react-hook-form's `onChange` handles it,
                                    // and Zod's `coerce` handles the conversion back to a number on submit.
                                    value={field.value ?? ''}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField control={form.control} name="status" render={({ field }) => ( <FormItem> <FormLabel>Initial Status</FormLabel> <Select onValueChange={field.onChange} value={field.value}><FormControl className={"rounded-full py-6"}><SelectTrigger><SelectValue placeholder="Select a status..." /></SelectTrigger></FormControl><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent> </Select><FormMessage /> </FormItem> )} />
            </div>
        </>
    );
}