// src/app/questionnaires/view/[id]/page_notnow.tsx

import { notFound } from "next/navigation";
import { getQuestionnaireById } from "@/lib/api/calls/questionnaire";
import QuestionnaireView from "@/components/view-questionnaire/QuestionnaireView";
// --- NEW: Import Metadata type ---
import { Metadata } from "next";

interface PageProps {
    params: {
        id: string;
    };
}

// --- NEW: generateMetadata function ---
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const id = parseInt(params.id, 10);
    const result = await getQuestionnaireById(id);

    // If the questionnaire exists, use its title for the page metadata
    if (result.status && result.data) {
        return {
            title: `View Feedback: ${result.data.title}`,
        };
    }

    // Otherwise, return a default title
    return {
        title: "Questionnaire Not Found",
    };
}

// The main page component remains the same
export default async function ViewQuestionnairePage({ params }: PageProps) {
    const id = parseInt(params.id, 10);
    const result = await getQuestionnaireById(id);
    const questionnaire = result.data;

    if (!result.status || !questionnaire) {
        console.error("Failed to fetch questionnaire:", result.error);
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container mx-auto p-4 py-8 sm:p-6 lg:p-12 max-w-5xl">
                <QuestionnaireView questionnaire={questionnaire} />
            </div>
        </div>
    );
}