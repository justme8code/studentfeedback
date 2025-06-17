"use client";

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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpenCheck, Edit3, Eye, Library, Search } from "lucide-react"; // Icons
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input"; // For potential search later
import { useState } from "react";

// --- Mock Data ---
const initialStudentCoursesData = [
    {
        id: "crs101",
        code: "CS101",
        name: "Introduction to Programming",
        instructor: "Dr. Alan Turing",
        semester: "Fall 2023",
        feedbackSubmitted: false,
    },
    {
        id: "crs202",
        code: "MAT202",
        name: "Calculus II",
        instructor: "Dr. Ada Lovelace",
        semester: "Fall 2023",
        feedbackSubmitted: true,
    },
    {
        id: "crs305",
        code: "PHY305",
        name: "Modern Physics",
        instructor: "Dr. Marie Curie",
        semester: "Spring 2024",
        feedbackSubmitted: false,
    },
    {
        id: "crs410",
        code: "ENG410",
        name: "Advanced Literature",
        instructor: "Prof. William Shakespeare",
        semester: "Spring 2024",
        feedbackSubmitted: true,
    },
    {
        id: "crs115",
        code: "ART115",
        name: "Introduction to Digital Art",
        instructor: "Prof. Leonardo da Vinci",
        semester: "Spring 2024",
        feedbackSubmitted: false,
    },
];
// --- End Mock Data ---

export default function CoursesPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState(""); // For search functionality

    const handleGiveFeedback = (courseId: string, courseName: string) => {
        // Navigate to the feedbacks submission form
        router.push(`/feedback/submit?courseId=${courseId}&courseName=${encodeURIComponent(courseName)}`);
        // Note: We updated the feedbacks submission page to potentially accept courseName as a query param.
        // Or directly to /feedbacks/submit/[courseId] if you prefer dynamic routes there too
        // alert(`Navigate to give feedbacks for: ${courseName} (ID: ${courseId})`);
    };

    const handleViewMyFeedback = (courseId: string) => {
        // Navigate to view the submitted feedbacks details
        router.push(`/feedback/view/${courseId}`);
    };

    const filteredCourses = initialStudentCoursesData.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">
                        Your Enrolled Courses
                    </CardTitle>
                    <CardDescription>
                        View your courses and provide or review feedback.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search courses by name, code, or instructor..."
                                className="w-full pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {/* Future: Add filters for semester, feedbacks status etc. */}
                    </div>

                    {filteredCourses.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[300px]">Course Name</TableHead>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Instructor</TableHead>
                                    <TableHead>Semester</TableHead>
                                    <TableHead className="text-center">Feedback Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCourses.map((course) => (
                                    <TableRow key={course.id}>
                                        <TableCell className="font-medium">{course.name}</TableCell>
                                        <TableCell>{course.code}</TableCell>
                                        <TableCell>{course.instructor}</TableCell>
                                        <TableCell>{course.semester}</TableCell>
                                        <TableCell className="text-center">
                                            {course.feedbackSubmitted ? (
                                                <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-200">
                                                    <BookOpenCheck className="mr-1 h-4 w-4" /> Submitted
                                                </Badge>
                                            ) : (
                                                <Badge variant="destructive">
                                                    Pending
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {course.feedbackSubmitted ? (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleViewMyFeedback(course.id)}
                                                >
                                                    <Eye className="mr-2 h-4 w-4" /> View My Feedback
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    onClick={() => handleGiveFeedback(course.id, course.name)}
                                                >
                                                    <Edit3 className="mr-2 h-4 w-4" /> Give Feedback
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            {filteredCourses.length > 5 && (
                                <TableCaption>A list of your enrolled courses.</TableCaption>
                            )}
                        </Table>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Library className="h-16 w-16 text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold">No Courses Found</h3>
                            <p className="text-muted-foreground">
                                {searchTerm ? "No student-courses match your search criteria." : "You are not currently enrolled in any student-courses, or no student-courses are available."}
                            </p>
                            {searchTerm && (
                                <Button variant="link" onClick={() => setSearchTerm("")}>Clear search</Button>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}