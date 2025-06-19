// src/components/feedback/FeedbackForm.tsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
// --- NEW: Import icons for the course details ---
import { Star, SlidersHorizontal, MessageSquare, BookUser, UserCircle, CalendarDays } from "lucide-react";
import React from "react";

// --- UI Components ---
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// --- Data, Schema, and Components ---
// --- UPDATED: Ensure you're importing the updated Questionnaire type ---
import { createDynamicFeedbackFormSchema, DynamicFeedbackFormData, Questionnaire2 } from "@/lib/schema";
import QuestionRenderer from "@/components/feedback/QuestionRenderer";
import {createFeedbackByQuestionnaireId} from "@/lib/api/calls/questionnaire";
import {useToast} from "@/lib/hooks/use-toast-store";

const questionIcons: { [key: string]: React.ElementType } = {
    rating: Star,
    slider: SlidersHorizontal,
    text: MessageSquare,
};

// The prop type is now the updated Questionnaire type
export default function FeedbackForm({ questionnaire }: { questionnaire: Questionnaire2 }) {
    const router = useRouter();
    // ... (rest of the component logic is unchanged) ...
    const formSchema = createDynamicFeedbackFormSchema(questionnaire.questions);
    const {showErrorToast,showSuccessToast} = useToast();

    const form = useForm<DynamicFeedbackFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            questionnaire_id: questionnaire.id,
            answers: questionnaire.questions.map(q => ({
                question_id: q.id,
                answer_text: "",
                answer_value: undefined,
            })),
        },
    });

    function onSubmit(values: DynamicFeedbackFormData) {
        const handleSaveAnswers = async ()=>{
            const {status,error} = await createFeedbackByQuestionnaireId(questionnaire.id,values.answers)
            if(status){
                showSuccessToast("Feedback submitted successfully!");
                router.push('/dashboard');
            }else{
                showErrorToast(error|| "Failed to submit feedback. You could try later");
            }
        }
        handleSaveAnswers();

    }

    return (
        <Card className="shadow-xl border-t-4 border-blue-600">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-slate-800">{questionnaire.title}</CardTitle>
                <CardDescription className="text-md text-slate-500 pt-1">
                    Your honest feedback helps us improve. Thank you for your time.
                </CardDescription>

                {/* --- NEW: Course Offering Details Section --- */}
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500 pt-4 border-t mt-4">
                    <div className="flex items-center gap-2">
                        <BookUser className="h-4 w-4" />
                        <span>
                            {questionnaire.course_offering.course.course_code}: {questionnaire.course_offering.course.course_title}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <UserCircle className="h-4 w-4" />
                        <span>{questionnaire.course_offering.lecturer.full_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        <span>{questionnaire.course_offering.semester.name}</span>
                    </div>
                </div>
                {/* --- End of New Section --- */}

            </CardHeader>
            <CardContent className="pt-8">
                <Form {...form}>
                    {/* The rest of the form remains exactly the same */}
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                        {/* ... form fields and questions ... */}
                        <FormField control={form.control} name="questionnaire_id" render={({ field }) => <input type="hidden" {...field} />} />

                        {questionnaire.questions.map((question, index) => {
                            const Icon = questionIcons[question.question_type] || MessageSquare;
                            return (
                                <div key={question.id} className="p-6 bg-white border rounded-lg shadow-sm space-y-4">
                                    <label className="text-xl font-semibold text-slate-700 flex items-start gap-3">
                                        <Icon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <span>{question.question_text}</span>
                                    </label>
                                    <FormField control={form.control} name={`answers.${index}.question_id`} render={({ field }) => <input type="hidden" {...field} />} />
                                    <QuestionRenderer
                                        control={form.control}
                                        question={question}
                                        index={index}
                                    />
                                </div>
                            )
                        })}

                        <CardFooter className="p-0 pt-4 flex-col sm:flex-row gap-4">
                            <Button type="button" variant="outline" size="lg" onClick={() => router.back()} className="w-full sm:w-auto">
                                Cancel
                            </Button>
                            <Button type="submit" size="lg" className="w-full sm:w-auto sm:ml-auto bg-blue-600 hover:bg-blue-700" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Submitting..." : "Submit My Feedback"}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}