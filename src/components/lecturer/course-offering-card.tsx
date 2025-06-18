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
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        {offering.course.course_code}
                    </CardTitle>
                    <Badge variant="secondary">{`Level ${offering.course.level}`}</Badge>
                </div>
                <CardDescription>{offering.course.course_title}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{offering.semester.name}</span>
                </div>
            </CardContent>
        </Card>
    );
}