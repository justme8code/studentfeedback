// /app/admin/create-questionnaire/components/question-list.tsx

"use client";

import { UseFormReturn, useFieldArray, FieldArrayWithId } from "react-hook-form";
import { QuestionnaireBuilderData } from "@/lib/schema";
import { QuestionCard } from "./question-card";
import {useEffect, useState} from "react";
import {Criterion} from "@/lib/types/criterion";
import {getCriteria} from "@/lib/api/calls/criterion";
import {useUserStore} from "@/lib/hooks/useUserStore";

// Define props to accept fields and remove directly
interface QuestionListProps {
    form: UseFormReturn<QuestionnaireBuilderData>;
    fields: FieldArrayWithId<QuestionnaireBuilderData, "questions", "id">[];
    remove: (index?: number | number[] | undefined) => void;
}

export function QuestionList({ form, fields, remove }: QuestionListProps) {
    // REMOVED: The useFieldArray hook is gone from here.
    const [criteria, setCriteria] = useState<Criterion[]>([]);
    const {user} = useUserStore();

    useEffect(() => {
        const fetchCriteria = async () => {
            if (user && user.id) {
                const result = await getCriteria();
                setCriteria(result.data || []);
            }
        }
        fetchCriteria();
    },[user]);

    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Questions</h3>
            {fields.length === 0 ? (
                <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                    <p>No questions yet. Add one below.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* It now maps over the 'fields' prop */}
                    {fields.map((field, index) => (
                        <QuestionCard
                            key={field.id}
                            index={index}
                            form={form}
                            remove={remove} // Pass down the 'remove' prop
                            criteria={criteria} // Pass criteria to
                        />
                    ))}
                </div>
            )}
            {form.formState.errors.questions?.message && (
                <p className="text-sm font-medium text-destructive mt-2">
                    {form.formState.errors.questions.message}
                </p>
            )}
        </div>
    );
}