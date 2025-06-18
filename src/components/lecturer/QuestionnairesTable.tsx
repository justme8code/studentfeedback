"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { format } from 'date-fns';
import { Questionnaire } from "@/lib/types/questionnaire"; // Import our updated type

interface QuestionnairesTableProps {
    questionnaires: Questionnaire[];
}

export function QuestionnairesTable({ questionnaires }: QuestionnairesTableProps) {
    const getStatusVariant = (status: Questionnaire['status']) => {
        switch (status) {
            case 'active': return 'default';
            case 'inactive': return 'secondary';
            case 'draft': return 'outline';
            default: return 'secondary';
        }
    };

    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[40%]">Title</TableHead>
                        <TableHead>Course</TableHead> {/* NEW: Added Course column */}
                        <TableHead>Feedback Round</TableHead>
                        <TableHead>Feedback Count</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {questionnaires.map((q) => (
                        <TableRow key={q.id}>
                            <TableCell className="font-medium">{q.title}</TableCell>
                            {/* NEW: Displaying the course code */}
                            <TableCell>
                                <Badge variant="outline">{q.course_offering.course_code}</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline">{q.feedback_round}</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline">{q.feedback_count}</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant={getStatusVariant(q.status)} className="capitalize">{q.status}</Badge>
                            </TableCell>
                            <TableCell>{format(new Date(q.created_at), 'PPP')}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>,

                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}