// /app/admin/create-questionnaire/components/add-question-controls.tsx

"use client";

import { UseFieldArrayAppend } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Star, SlidersHorizontal, MessageSquare } from "lucide-react";
import { QuestionnaireBuilderData } from "@/lib/schema";

interface AddQuestionControlsProps {
    append: UseFieldArrayAppend<QuestionnaireBuilderData, "questions">;
}

export function AddQuestionControls({ append }: AddQuestionControlsProps) {
    return (
        // UPDATED: Changed the hardcoded border to use a theme-aware color with opacity.
        // This looks much better in dark mode.
        <div className="p-4 border-2 border-dashed rounded-lg border-muted-foreground/30">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <h4 className="text-md font-semibold text-muted-foreground">Add a new question:</h4>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => append({ question_text: "", question_type: 'rating', criteria_id: '' })}> <Star className="h-4 w-4 mr-2" /> Rating </Button>
                    <Button type="button" variant="outline" onClick={() => append({ question_text: "", question_type: 'slider', criteria_id: '' })}> <SlidersHorizontal className="h-4 w-4 mr-2" /> Slider </Button>
                    <Button type="button" variant="outline" onClick={() => append({ question_text: "", question_type: 'text', criteria_id: '' })}> <MessageSquare className="h-4 w-4 mr-2" /> Text </Button>
                </div>
            </div>
        </div>
    );
}