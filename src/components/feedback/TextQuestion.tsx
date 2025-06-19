// src/components/feedback/TextQuestion.tsx
// NO CHANGES NEEDED - This component is already perfectly responsive.

"use client";

import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { DynamicFeedbackFormData, QuestionnaireQuestion } from "@/lib/schema";

interface QuestionProps {
    control: Control<DynamicFeedbackFormData>;
    question: QuestionnaireQuestion;
    index: number;
}

export default function TextQuestion({ control, question, index }: QuestionProps) {
    return (
        <FormField
            control={control}
            name={`answers.${index}.answer_text`}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="sr-only">{question.question_text}</FormLabel>
                    <FormControl>
                        <Textarea
                            placeholder="Your detailed feedback here..."
                            className="min-h-[120px] resize-y focus-visible:ring-2 focus-visible:ring-blue-500/50"
                            {...field}
                        />
                    </FormControl>
                    <FormMessage className="pt-2" />
                </FormItem>
            )}
        />
    );
}