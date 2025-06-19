// src/components/feedback/RatingQuestion.tsx

"use client";

import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DynamicFeedbackFormData, QuestionnaireQuestion } from "@/lib/schema";

const ratingLabels: { [key: number]: string } = {
    1: "Very Poor", 2: "Poor", 3: "Average", 4: "Good", 5: "Excellent",
};

interface QuestionProps {
    control: Control<DynamicFeedbackFormData>;
    question: QuestionnaireQuestion;
    index: number;
}

export default function RatingQuestion({ control, question, index }: QuestionProps) {
    return (
        <FormField
            control={control}
            name={`answers.${index}.answer_value`}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="sr-only">{question.question_text}</FormLabel>
                    <FormControl>
                        <RadioGroup
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            value={field.value?.toString()}
                            // On mobile, use a smaller gap.
                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4"
                        >
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <FormItem key={rating}>
                                    <FormControl>
                                        <RadioGroupItem value={rating.toString()} id={`q-${question.id}-r-${rating}`} className="sr-only peer" />
                                    </FormControl>
                                    <FormLabel
                                        htmlFor={`q-${question.id}-r-${rating}`}
                                        // On mobile: smaller padding. On sm screens and up: larger padding.
                                        className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 sm:p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 [&:has([data-state=checked])]:bg-blue-50 transition-colors cursor-pointer"
                                    >
                                        {/* On mobile: smaller font size. On sm screens and up: larger font size. */}
                                        <span className="text-xl sm:text-2xl font-bold">{rating}</span>
                                        <span className="mt-1.5 text-center text-sm">{ratingLabels[rating]}</span>
                                    </FormLabel>
                                </FormItem>
                            ))}
                        </RadioGroup>
                    </FormControl>
                    <FormMessage className="pt-2" />
                </FormItem>
            )}
        />
    );
}