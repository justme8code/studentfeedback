'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { Criterion } from "@/lib/types/criterion";

interface CriterionItemProps {
    criterion: Criterion;
    onEdit: (criterion: Criterion) => void;
}

export function CriterionItem({ criterion, onEdit }: CriterionItemProps) {
    return (
        <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-medium text-gray-900">{criterion.name}</h3>
                        <Badge variant="secondary">{criterion.weight.toFixed(1)}%</Badge>
                        <Badge className={criterion.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}>
                            {criterion.isActive ? "Active" : "Inactive"}
                        </Badge>
                    </div>
                    {criterion.description && <p className="text-sm text-gray-600 mb-2">{criterion.description}</p>}
                    <p className="text-xs text-gray-500">Created: {new Date(criterion.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(criterion)}><Edit className="h-4 w-4" /></Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={true}
                        title="Delete functionality is currently disabled"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}