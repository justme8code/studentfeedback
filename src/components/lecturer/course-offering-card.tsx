"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar } from "lucide-react";
import { CourseOfferingWithDetails } from "@/lib/types/course-offering";

interface CourseOfferingCardProps {
    offering: CourseOfferingWithDetails;
}

export function CourseOfferingCard({ offering }: CourseOfferingCardProps) {
    return (
        <Card className="max-w-xl w-full mx-auto mb-4 shadow-sm hover:shadow-md transition-shadow rounded-2xl border border-border bg-background">
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        {offering.course.course_code}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">{`Level ${offering.course.level}`}</Badge>
                </div>
                <CardDescription className="text-sm text-muted-foreground mt-1">
                    {offering.course.course_title}
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 text-sm">
                <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{offering.semester.name}</span>
                </div>
            </CardContent>
        </Card>

    );
}