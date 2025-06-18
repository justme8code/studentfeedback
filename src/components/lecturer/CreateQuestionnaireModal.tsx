// /app/admin/questionnaires/components/create-questionnaire-modal.tsx

"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {QuestionnaireForm} from "@/components/lecturer/QustionnaireForm";

interface CreateQuestionnaireModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateQuestionnaireModal({ open, onOpenChange }: CreateQuestionnaireModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/* UPDATED: Added a class for a consistent background, making our card styles stand out. */}
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-background dark:bg-slate-950">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Create New Questionnaire</DialogTitle>
                    <DialogDescription>
                        Build a new feedback form by adding and organizing questions below.
                    </DialogDescription>
                </DialogHeader>
                <QuestionnaireForm onFinished={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
}