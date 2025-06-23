// /app/admin/create-questionnaire/components/questionnaire-details-form.tsx

"use client";

import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuestionnaireBuilderData } from "@/lib/schema";
import { useEffect, useState } from "react";
import { getAllCourseOfferingsByLecturerId } from "@/lib/api/calls/course-offerings";
import { useUserStore } from "@/lib/hooks/useUserStore";
import {CourseOfferingWithDetails} from "@/lib/types/course-offering";



export interface Course {
    id: number;
    course_code: string;
    course_title: string;
    level: number;
}



interface QuestionnaireDetailsFormProps {
    form: UseFormReturn<QuestionnaireBuilderData>;
}

export function QuestionnaireDetailsForm({ form }: QuestionnaireDetailsFormProps) {
    const { user } = useUserStore();

    const [offerings, setOfferings] = useState<CourseOfferingWithDetails[]>([]);


    useEffect(() => {
        const fetchOfferings = async () => {
            if (user && user.id) {
                const result = await getAllCourseOfferingsByLecturerId(user.id);
                if (result.data) {
                    // --- STEP 3: STORE THE ENTIRE ARRAY OF OFFERINGS, NOT JUST THE COURSES ---
                    setOfferings(result.data);
                } else {
                    console.error("Failed to fetch course offerings:", result.error);
                    setOfferings([]); // Set to empty on failure
                }
            }
        }

        fetchOfferings();
    }, [user]);

    return (
        <>
            <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Questionnaire Title</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., End of Semester Feedback" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <FormField
                    control={form.control}
                    name="course_offering_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Course Offering</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl className={"rounded-full py-6"}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a course..." />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {/* --- STEP 4: UPDATE THE MAPPING LOGIC TO USE THE CORRECT IDs AND TEXT --- */}
                                    {offerings.map(offering => (
                                        <SelectItem
                                            key={offering.id} /* Use the unique course_offering_id */
                                            value={offering.id.toString()} /* Send the correct course_offering_id */
                                        >
                                            {/* Display the course title and code */ }
                                            {offering.course.course_title} - {offering.course.course_code}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

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
                                    value={field.value ?? ''}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Initial Status</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl className={"rounded-full py-6"}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a status..." />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </>
    );
}