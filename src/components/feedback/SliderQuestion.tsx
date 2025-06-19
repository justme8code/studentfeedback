// src/components/feedback/SliderQuestion.tsx

"use client";

import { Control, useWatch } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { DynamicFeedbackFormData, QuestionnaireQuestion } from "@/lib/schema";

interface QuestionProps {
    control: Control<DynamicFeedbackFormData>;
    question: QuestionnaireQuestion;
    index: number;
}

export default function SliderQuestion({ control, question, index }: QuestionProps) {
    const sliderValue = useWatch({ control, name: `answers.${index}.answer_value` }) || 50;

    return (
        <FormField
            control={control}
            name={`answers.${index}.answer_value`}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="sr-only">{question.question_text}</FormLabel>
                    {/* KEY CHANGE: Default to flex-col (stacked), switch to flex-row on 'sm' screens */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <FormControl className="flex-grow">
                            <Slider
                                className="[&>span:first-child]:h-2 [&>span:first-child>span]:bg-blue-600 [&>span:last-child]:h-5 [&>span:last-child]:w-5 [&>span:last-child]:border-blue-600"
                                value={[field.value || 50]}
                                min={1} max={100} step={1}
                                onValueChange={(value) => field.onChange(value[0])}
                            />
                        </FormControl>
                        {/* On mobile, this box takes full width. On 'sm' and up, it shrinks. */}
                        <div className="flex-shrink-0 w-full sm:w-16 h-12 flex items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                            <span className="text-xl font-bold">{sliderValue}</span>
                        </div>
                    </div>
                    <FormMessage className="pt-2" />
                </FormItem>
            )}
        />
    );
}