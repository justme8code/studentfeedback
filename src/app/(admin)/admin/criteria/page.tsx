'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { useCriteria } from "@/lib/hooks/api/criteria";
import { Criterion } from "@/lib/types/criterion";
import {CriteriaList} from "@/components/CriteriaList";
import {CriterionFormDialog} from "@/components/CriterionFormDialog";


export default function Page() {
    // State for controlling the dialog and the item being edited
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCriterion, setEditingCriterion] = useState<Criterion | null>(null);

    // Fetch data using the hook.
    // This is the correct pattern! By providing a default `[]`,
    // `criteria` is guaranteed to be an array, never null or undefined.
    const { data: criteria = [], isLoading, isError, error } = useCriteria();

    const handleAdd = () => {
        setEditingCriterion(null); // Ensure we are in "create" mode
        setIsDialogOpen(true);
    };

    const handleEdit = (criterion: Criterion) => {
        setEditingCriterion(criterion); // Set the item to edit
        setIsDialogOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Feedback Criteria Management</h1>
                        <p className="text-sm text-gray-600">Manage the criteria used for course evaluations</p>
                    </div>

                    <Button onClick={handleAdd} disabled={isLoading || isError}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Criterion
                    </Button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <CriteriaList
                    criteria={criteria??[]}
                    isLoading={isLoading}
                    isError={isError}
                    error={error}
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                />
            </div>

            <CriterionFormDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                editingCriterion={editingCriterion}
                existingCriteria={criteria??[]}
            />
        </div>
    );
}