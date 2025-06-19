"use client";

import { Control } from "react-hook-form";
import { DynamicFeedbackFormData, QuestionnaireQuestion } from "@/lib/schema";
import RatingQuestion from "./RatingQuestion";
import SliderQuestion from "./SliderQuestion";
import TextQuestion from "./TextQuestion";

interface QuestionProps {
    control: Control<DynamicFeedbackFormData>;
    question: QuestionnaireQuestion;
    index: number;
}

export default function QuestionRenderer({ control, question, index }: QuestionProps) {
    switch (question.question_type) {
        case "rating":
            return <RatingQuestion control={control} question={question} index={index} />;
        case "slider":
            return <SliderQuestion control={control} question={question} index={index} />;
        case "text":
            return <TextQuestion control={control} question={question} index={index} />;
        default:
            return <p>Unsupported question type: {question.question_type}</p>;
    }
}