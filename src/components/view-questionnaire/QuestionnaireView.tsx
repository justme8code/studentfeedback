// src/components/view-questionnaire/QuestionnaireView.tsx

"use client";


import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import QuestionDetailsHeader from "@/components/view-questionnaire/QuestionnaireDetailsHeader";
import QuestionFeedbackCard from "./QuestionnaireFeedbackCard";
import {Questionnaire2} from "@/lib/schema";

export default function QuestionnaireView({ questionnaire }: { questionnaire: Questionnaire2 }) {
    const router = useRouter();

    return (
        <div className="space-y-8">
            <Button variant="outline" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
            </Button>

            <QuestionDetailsHeader questionnaire={questionnaire} />

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800 border-b pb-2">
                    Submitted Feedback by Question
                </h2>
                {questionnaire.questions.map((question) => (
                    <QuestionFeedbackCard key={question.id} question={question} questionnaireId={questionnaire.id} />
                ))}
            </div>
        </div>
    );
}