"use client"; // For potential client-side interactions later

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Eye, MessageSquareDashed } from "lucide-react"; // Icons
import { useRouter } from "next/navigation";

// --- Mock Data ---
// This would come from an API, filtered for the current user and submitted feedbacks
const submittedFeedbacks = [
    {
        courseId: "crs202",
        courseCode: "MAT202",
        courseName: "Calculus II",
        instructor: "Dr. Ada Lovelace",
        dateSubmitted: "2023-11-15",
        // Potentially a summary or link to the full feedbacks details
        feedbackSummary: "Overall a challenging but rewarding course. Instructor was excellent.",
        overallRating: 5, // Example, you might fetch this
    },
    {
        courseId: "crs501",
        courseCode: "HIS501",
        courseName: "World History: Ancient Civilizations",
        instructor: "Prof. Herodotus",
        dateSubmitted: "2023-10-28",
        feedbackSummary: "Materials were engaging. Could use more interactive sessions.",
        overallRating: 4,
    },
    // Add more mock data as needed
];

// To simulate an empty state, you can temporarily make submittedFeedbacks an empty array:
// const submittedFeedbacks = [];
// --- End Mock Data ---

export default function MyFeedbackPage() {
    const router = useRouter();

    const handleViewDetails = (courseId: string, courseName: string) => {
        // Navigate to the dynamic view page
        router.push(`/feedbacks/view/${courseId}`);
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">
                        My Submitted Feedback
                    </CardTitle>
                    <CardDescription>
                        Here you can review the feedback you've previously submitted for your courses.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {submittedFeedbacks.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[250px]">Course</TableHead>
                                    <TableHead>Instructor</TableHead>
                                    <TableHead className="text-center">Overall Rating</TableHead>
                                    <TableHead className="text-center">Date Submitted</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {submittedFeedbacks.map((feedback) => (
                                    <TableRow key={feedback.courseId}>
                                        <TableCell className="font-medium">
                                            {feedback.courseName}
                                            <div className="text-xs text-muted-foreground">{feedback.courseCode}</div>
                                        </TableCell>
                                        <TableCell>{feedback.instructor}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={feedback.overallRating >= 4 ? "default" : feedback.overallRating === 3 ? "secondary" : "destructive"}>
                                                {feedback.overallRating}/5 Stars
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {new Date(feedback.dateSubmitted).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewDetails(feedback.courseId, feedback.courseName)}
                                            >
                                                <Eye className="mr-2 h-4 w-4" />
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            {submittedFeedbacks.length > 5 && ( // Show caption if more than 5 items, for example
                                <TableCaption>A list of your submitted feedback.</TableCaption>
                            )}
                        </Table>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <MessageSquareDashed className="h-16 w-16 text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold">No Feedback Submitted Yet</h3>
                            <p className="text-muted-foreground mb-6">
                                It looks like you haven't submitted any feedback for your courses.
                            </p>
                            <Button onClick={() => router.push("/dashboard")}>
                                Go to Dashboard
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}