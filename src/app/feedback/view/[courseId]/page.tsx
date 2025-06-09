"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Star, MessageCircle, Zap, BookOpen, ThumbsUp, ThumbsDown, FileText, AlertCircle, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

// --- Mock Data & Fetch Function ---
// (Same mock data structure as previously defined, including detailed fields)
const detailedFeedbackMockData: { [key: string]: any } = {
    crs202: {
        courseId: "crs202",
        courseCode: "MAT202",
        courseName: "Calculus II",
        instructor: "Dr. Ada Lovelace",
        dateSubmitted: "2023-11-15",
        overallRating: 5,
        instructorClarity: 5,
        courseRelevance: 4,
        workload: 3,
        likedMost: "The instructor's explanations were incredibly clear, and the problem-solving sessions were very helpful. I finally understood concepts I struggled with before.",
        suggestionsForImprovement: "Perhaps a few more real-world examples for some of the more abstract topics could be beneficial. The textbook was a bit dense at times.",
        comments: "Overall, a fantastic and challenging course. Dr. Lovelace is an amazing instructor!"
    },
    crs501: {
        courseId: "crs501",
        courseCode: "HIS501",
        courseName: "World History: Ancient Civilizations",
        instructor: "Prof. Herodotus",
        dateSubmitted: "2023-10-28",
        overallRating: 4,
        instructorClarity: 4,
        courseRelevance: 5,
        workload: 2,
        likedMost: "The breadth of civilizations covered was impressive, and the primary source readings were very insightful.",
        suggestionsForImprovement: "The pacing felt a bit rushed in the last few weeks. Maybe an extra week or slightly less content towards the end.",
        comments: "A very good course, learned a lot. The instructor is passionate about the subject."
    }
};

// Simulate API call
const fetchFeedbackDetails = async (courseId: string): Promise<any | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const feedback = detailedFeedbackMockData[courseId];
            resolve(feedback || null);
        }, 500); // Simulate network delay
    });
};

// Helper for rating labels (same as in submit form)
const ratingLabels: { [key: number]: string } = {
    1: "Very Poor", 2: "Poor", 3: "Average", 4: "Good", 5: "Excellent",
};
// --- End Mock Data ---


interface FeedbackDetails {
    courseId: string;
    courseCode: string;
    courseName: string;
    instructor: string;
    dateSubmitted: string;
    overallRating: number;
    instructorClarity: number;
    courseRelevance: number;
    workload: number;
    likedMost?: string;
    suggestionsForImprovement?: string;
    comments?: string;
}

export default function ViewFeedbackDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const courseId = params.courseId as string; // Get courseId from route

    const [feedback, setFeedback] = useState<FeedbackDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (courseId) {
            setLoading(true);
            fetchFeedbackDetails(courseId)
                .then((data) => {
                    if (data) {
                        setFeedback(data);
                    } else {
                        setError("Feedback details not found for this course.");
                    }
                })
                .catch(() => setError("Failed to fetch feedback details."))
                .finally(() => setLoading(false));
        }
    }, [courseId]);

    if (loading) {
        return (
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-3xl">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-1/2 mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-5 w-1/3" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-10 w-24" />
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-3xl">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button onClick={() => router.back()} variant="outline" className="mt-4">
                    <ArrowLeft className="mr-2 h-4 w-4"/> Go Back
                </Button>
            </div>
        );
    }

    if (!feedback) {
        // This case should ideally be handled by the error state from fetch
        return (
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-3xl">
                Feedback not found.
                <Button onClick={() => router.back()} variant="outline" className="mt-4">
                    <ArrowLeft className="mr-2 h-4 w-4"/> Go Back
                </Button>
            </div>
        );
    }

    const renderRatingDetail = (label: string, value: number, icon: React.ReactNode) => (
        <div className="mb-4">
            <h4 className="text-md font-semibold mb-1 flex items-center">
                {icon} {label}:
                <Badge variant="secondary" className="ml-2">{value}/5 - {ratingLabels[value]}</Badge>
            </h4>
        </div>
    );

    const renderTextDetail = (label: string, text: string | undefined, icon: React.ReactNode) =>
        text && text.trim() !== "" && (
            <div className="mb-6">
                <h4 className="text-md font-semibold mb-1 flex items-center">
                    {icon} {label}
                </h4>
                <p className="text-muted-foreground whitespace-pre-wrap bg-muted p-3 rounded-md">{text}</p>
            </div>
        );


    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-3xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        Your Feedback for: {feedback.courseName} ({feedback.courseCode})
                    </CardTitle>
                    <CardDescription>
                        Submitted on: {new Date(feedback.dateSubmitted).toLocaleDateString()} by {feedback.instructor}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {renderRatingDetail("Overall Course Rating", feedback.overallRating, <Star className="mr-2 h-5 w-5 text-yellow-500" />)}

                    <Separator />

                    <div>
                        <h3 className="text-lg font-semibold mb-3">Specific Aspects:</h3>
                        {renderRatingDetail("Instructor's Clarity", feedback.instructorClarity, <MessageCircle className="mr-2 h-5 w-5 text-blue-500" />)}
                        {renderRatingDetail("Course Material Relevance", feedback.courseRelevance, <BookOpen className="mr-2 h-5 w-5 text-green-500" />)}
                        {renderRatingDetail("Course Workload", feedback.workload, <Zap className="mr-2 h-5 w-5 text-red-500" />)}
                    </div>

                    <Separator />

                    {renderTextDetail("What you liked most:", feedback.likedMost, <ThumbsUp className="mr-2 h-5 w-5 text-sky-500" />)}
                    {renderTextDetail("Suggestions for improvement:", feedback.suggestionsForImprovement, <ThumbsDown className="mr-2 h-5 w-5 text-orange-500" />)}
                    {renderTextDetail("Additional Comments:", feedback.comments, <FileText className="mr-2 h-5 w-5 text-gray-500" />)}

                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={() => router.push("/my-feedback")} variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4"/> Back to My Feedback
                    </Button>
                    {/* Optionally, add an "Edit Feedback" button if functionality exists */}
                    {/* <Button onClick={() => router.push(`/feedback/edit/${feedback.courseId}`)} className="ml-2">
            Edit Feedback
          </Button> */}
                </CardFooter>
            </Card>
        </div>
    );
}