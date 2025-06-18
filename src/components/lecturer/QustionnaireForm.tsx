"use client";

import { useState } from "react"; // NEW: Import useState for loading/error state
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // NEW: For showing errors
import { AlertCircle } from "lucide-react";

import { questionnaireBuilderSchema, QuestionnaireBuilderData } from "@/lib/schema";

// NEW: Import your API function
import { createQuestionnaire } from "@/lib/api/calls/questionnaire";
import {QuestionnaireDetailsForm} from "@/components/lecturer/question-details-form";
import {QuestionList} from "@/components/lecturer/question-list";
import {AddQuestionControls} from "@/components/lecturer/add-question-control";
import {useToast} from "@/lib/hooks/use-toast-store";
import {Questionnaire, QuestionnaireCreatePayload} from "@/lib/types/questionnaire";

interface QuestionnaireFormProps {
    onFinished: () => void;
}

export function QuestionnaireForm({ onFinished }: QuestionnaireFormProps) {
    // NEW: State for managing submission status and errors
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const {showSuccessToast,showErrorToast} = useToast();

    const form = useForm<QuestionnaireBuilderData>({
        resolver: zodResolver(questionnaireBuilderSchema),
        defaultValues: { title: "", course_offering_id: "", feedback_round: undefined, status: "inactive", questions: [] },
    });

    const { fields, append, remove } = useFieldArray({ control: form.control, name: "questions" });

    // UPDATED: This function will now build the payload and call your API
    async function onSubmit(data: QuestionnaireBuilderData) {
        setIsSubmitting(true);
        setErrorMessage(null);

        // 1. Build the payload to match your API's expectations
        const apiPayload: QuestionnaireCreatePayload = {
            title: data.title,
            course_offering_id: parseInt(data.course_offering_id, 10),
            feedback_round: data.feedback_round,
            status: data.status,
            questions: data.questions.map((question, index) => ({
                question_text: question.question_text,
                question_type: question.question_type,
                order: index + 1,
                criteria_id: parseInt(question.criteria_id, 10),
            })),
        };


        try {
            // 2. Call the API
            const result
                = await createQuestionnaire(apiPayload);

            if (result.error) {
                // Handle API error
                showErrorToast(result.error || "Failed to create questionnaire.");
            }

            // 3. Handle Success
            showSuccessToast("Questionnaire created successfully!");
            onFinished(); // Close the modal

        } catch (error) {
            // 4. Handle Unexpected Errors
            const message = error instanceof Error ? error.message : "An unknown error occurred during submission.";
            showErrorToast(message);
        } finally {
            // 5. Reset loading state
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-6 px-1">
                    <QuestionnaireDetailsForm form={form} />
                    <Separator />
                    <QuestionList form={form} fields={fields} remove={remove} />
                    <AddQuestionControls append={append} />
                </div>

                {/* NEW: Display API error message if it exists */}
                {errorMessage && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Submission Failed</AlertTitle>
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onFinished} disabled={isSubmitting}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Questionnaire"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}