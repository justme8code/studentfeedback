"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { format } from 'date-fns';
import { Questionnaire } from "@/lib/types/questionnaire";
import { updateQuestionnaireStatus } from "@/lib/api/calls/questionnaire";
import { useToast } from "@/lib/hooks/use-toast-store";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandItem } from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";

interface QuestionnairesTableProps {
    questionnaires: Questionnaire[];
}

export function QuestionnairesTable({ questionnaires }: QuestionnairesTableProps) {
    const [questionnaireList, setQuestionnaireList] = useState<Questionnaire[]>(questionnaires);
    const { showSuccessToast, showErrorToast } = useToast();
    const router = useRouter();

    const getStatusVariant = (status: Questionnaire['status']) => {
        switch (status) {
            case 'active': return 'default';
            case 'inactive': return 'secondary';
            default: return 'secondary';
        }
    };

    const handleUpdateQuestionnaireStatus = async (id: number, current: string) => {
        const { status } = await updateQuestionnaireStatus(id, current);
        if (status) {
            showSuccessToast("Questionnaire status updated successfully.");
            setQuestionnaireList(prev =>
                prev.map(q =>
                    q.id === id
                        ? { ...q, status: current === "active" ? "inactive" : "active" }
                        : q
                )
            );
        } else {
            showErrorToast("Questionnaire status update failed");
        }
    };

    return (
        <div className="w-full gap-10 grid grid-cols-1 md:grid-cols-2  ">
            {questionnaireList.map((q) => (
                <Card
                    key={q.id}
                    className="p-5 border rounded-xl shadow-sm hover:shadow-md transition bg-background cursor-pointer group"
                    onClick={() => router.push(`/lecturers/questionnaires/${q.id}`)}
                >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold leading-snug group-hover:text-primary transition">
                                {q.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Created on {format(new Date(q.created_at), 'PPP')}
                            </p>
                        </div>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:bg-muted"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48 p-2" align="end" onClick={(e) => e.stopPropagation()}>
                                <Command>
                                    <CommandItem onSelect={() => handleUpdateQuestionnaireStatus(q.id, q.status)}>
                                        {q.status === "active" ? "Deactivate" : "Activate"}
                                    </CommandItem>
                                    <CommandItem onSelect={() => console.log("Delete clicked")}>
                                        Delete (coming soon 🔒)
                                    </CommandItem>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Divider */}
                    <div className="my-3 border-t" />

                    {/* Content Meta Info */}
                    <div className="flex flex-wrap gap-2 text-sm">
                        <Badge variant="outline">
                            {q.course_offering?.course_code ?? "Unknown Course"}
                        </Badge>
                        <Badge variant="outline">Round {q.feedback_round}</Badge>
                        <Badge variant="outline">{q.feedback_count} Feedbacks</Badge>
                        <Badge variant={getStatusVariant(q.status)} className="capitalize">
                            {q.status}
                        </Badge>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 flex justify-end">
                        <Button
                            variant="link"
                            size="sm"
                            className="text-muted-foreground hover:text-primary"
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/lecturers/questionnaires/view/${q.id}`);
                            }}
                        >
                            View Details →
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    );
}
