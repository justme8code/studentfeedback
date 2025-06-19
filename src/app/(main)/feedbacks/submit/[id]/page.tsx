import { notFound } from "next/navigation";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import { getQuestionnaireById } from "@/lib/api/calls/questionnaire"; // Using your real API call

interface PageProps {
    params: {
        id: string;
    };
}

export default async function SubmitFeedbackPage({ params }: PageProps) {
    const id = parseInt(params.id, 10);

    // 1. Get the result from your API call
    const result = await getQuestionnaireById(id);

    // 2. Extract the actual questionnaire data from the 'data' property
    const questionnaireData = result.data;

    // 3. Check if the fetch was successful AND if data exists
    if (!result.status || !questionnaireData) {
        // You could also log result.error here for server-side debugging
        console.error("Failed to fetch questionnaire:", result.error);
        notFound(); // Render the 404 page
    }

    // 4. Pass ONLY the questionnaireData to the client component
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container mx-auto p-4 py-8 sm:p-6 lg:p-12 max-w-4xl">
                <FeedbackForm questionnaire={questionnaireData} />
            </div>
        </div>
    );
}