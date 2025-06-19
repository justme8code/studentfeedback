// src/components/view-questionnaire/QuestionFeedbackCard.tsx

"use client";

import { useEffect, useState } from "react";
import { FeedbackAnswer, QuestionnaireQuestion } from "@/lib/schema";

import { AlertCircle, Loader2, MessageSquare, Star, SlidersHorizontal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {getFeedbackForQuestion} from "@/lib/api/calls/questionnaire";

const questionTypeIcons = {
    text: MessageSquare,
    rating: Star,
    slider: SlidersHorizontal,
};

export default function QuestionFeedbackCard({ question , questionnaireId}: { question: QuestionnaireQuestion, questionnaireId: number }) {
    const [feedback, setFeedback] = useState<FeedbackAnswer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const Icon = questionTypeIcons[question.question_type];

    useEffect(() => {
        // ... (fetching logic remains the same) ...
        const fetchFeedback = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const result = await getFeedbackForQuestion(questionnaireId,question.id);
                if (result.status && result.data) {
                    setFeedback(result.data.data);
                } else {
                    setError(result.error || "Failed to load feedback.");
                }
            } catch (err) {
                setError("An unexpected error occurred while fetching feedback.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeedback();
    }, [question.id]);


    const renderFeedbackContent = () => {
        // ... (render logic remains the same) ...
        if (isLoading) {
            return <div className="flex items-center justify-center h-24"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>;
        }
        if (error) {
            return (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            );
        }
        if (feedback.length === 0) {
            return <p className="text-sm text-center text-slate-500 py-8">No feedback has been submitted for this question yet.</p>;
        }
        return (
            <ul className="space-y-3 pt-4">
                {feedback.map((answer) => (
                    <li key={answer.id} className="p-3 bg-slate-50 rounded-md border border-slate-200">
                        <div className="text-slate-800 font-medium">
                            {answer.answer_text ? <blockquote className="italic">"{answer.answer_text.trim()}"</blockquote> : <span className="text-blue-600">Value: {answer.answer_value}</span>}
                        </div>
                        <p className="text-xs text-slate-400 mt-2 text-right">
                            Submitted: {new Date(answer.submitted_at).toLocaleDateString()}
                        </p>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        // Changed from <Card> to a styled <div> for a cleaner, flatter look
        <div className="p-6 bg-white border border-slate-200 rounded-lg">
            <div className="flex items-start gap-3">
                <Icon className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                    <h3 className="text-lg font-semibold text-slate-700">{question.question_text}</h3>
                    <p className="text-sm text-slate-500">Criterion: {question.criterion.name}</p>
                </div>
            </div>
            {renderFeedbackContent()}
        </div>
    );
}