'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { Criterion } from "@/lib/types/criterion";
import { CriterionItem } from "./CriterionItem";

interface CriteriaListProps {
    criteria: Criterion[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    onEdit: (criterion: Criterion) => void;
    onAdd: () => void;
}

export function CriteriaList({ criteria, isLoading, isError, error, onEdit, onAdd }: CriteriaListProps) {
    const totalWeight = criteria.reduce((sum, c) => sum + (c.weight || 0), 0);

    const renderContent = () => {
        if (isLoading) {
            return <div className="text-center py-8 flex items-center justify-center"><Loader2 className="mr-2 h-5 w-5 animate-spin" />Loading criteria...</div>;
        }
        if (isError) {
            return <div className="text-center py-8 text-red-600">Error: {error?.message || "Failed to load criteria."}</div>;
        }
        if (criteria.length === 0) {
            return (
                <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No feedback criteria defined yet.</p>
                    <Button onClick={onAdd}><Plus className="h-4 w-4 mr-2" />Add Your First Criterion</Button>
                </div>
            );
        }
        return (
            <div className="space-y-4">
                {criteria.map((criterion) => (
                    <CriterionItem key={criterion.id} criterion={criterion} onEdit={onEdit} />
                ))}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Weight Distribution</h4>
                    <div className="text-sm text-blue-700">
                        Total Weight: {totalWeight.toFixed(1)}%
                        {totalWeight !== 100 && <span className="text-orange-600 ml-2">(Should total 100% for balanced evaluation)</span>}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Card>
            <CardHeader><CardTitle>Current Criteria</CardTitle></CardHeader>
            <CardContent>{renderContent()}</CardContent>
        </Card>
    );
}