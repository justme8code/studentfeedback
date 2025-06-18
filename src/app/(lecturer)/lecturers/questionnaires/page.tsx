"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, AlertCircle } from "lucide-react";
import { QuestionnairesTable } from "@/components/lecturer/QuestionnairesTable"; // Adjust path if needed
import { CreateQuestionnaireModal } from "@/components/lecturer/CreateQuestionnaireModal"; // Adjust path if needed
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Import hooks, API functions, and types
import { useUserStore } from "@/lib/hooks/useUserStore";
import { Questionnaire } from "@/lib/types/questionnaire";
import {getLecturerQuestionnaires} from "@/lib/api/calls/lecturer";

export default function QuestionnairesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State for managing data, loading, and errors
    const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { user } = useUserStore();

    // Fetch data when the component mounts or the user changes
    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        async function loadQuestionnaires() {
            setIsLoading(true);
            setError(null);
            if(user != null && user.id !=null){
                const result = await getLecturerQuestionnaires(user.id.toString());
                if (result.error) {
                    setError(result.error);
                } else if (result.data) {
                    setQuestionnaires(result.data);
                }
                setIsLoading(false);
            }

        }

        loadQuestionnaires();
    }, [user]);

    // Helper to render the table or its state
    const renderTableContent = () => {
        if (isLoading) {
            // Simple skeleton loader for the table
            return (
                <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            );
        }

        if (error) {
            return (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Failed to load data</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            );
        }

        if (questionnaires.length === 0) {
            return <p className="text-center text-muted-foreground py-8">No questionnaires found.</p>;
        }

        return <QuestionnairesTable questionnaires={questionnaires} />;
    };

    return (
        <>
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Questionnaires</h1>
                        <p className="text-muted-foreground">Manage and create feedback forms.</p>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create New
                    </Button>
                </div>

                {renderTableContent()}
            </div>

            <CreateQuestionnaireModal open={isModalOpen} onOpenChange={setIsModalOpen} />
        </>
    );
}