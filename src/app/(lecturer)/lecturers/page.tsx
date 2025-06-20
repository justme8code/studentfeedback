'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Star, TrendingUp, MessageSquare } from "lucide-react";

// --- Assuming these are in the correct path ---

import {useUserStore} from "@/lib/hooks/useUserStore";
import {useToast} from "@/lib/hooks/use-toast-store";
import { useLecturerDashboardOverviewQuery } from "@/lib/hooks/kpi/useLecturerDashboardOverview";
import {useActiveSession} from "@/lib/hooks/kpi/useCurrentSession";
import {useLecturerCoursePerformance} from "@/lib/hooks/kpi/useLecturerCoursePerformance";
import FeedbackDistributionChart from "@/components/charts/FeedbackDistributionChart";
import RatingTrendsChart from "@/components/charts/RatingTrendsChart";
import {useRecentFeedbacks} from "@/lib/hooks/kpi/useRecentFeedbacks";

// --- MOCK DATA ---
const mockUser = {
    id: 1,
    firstName: "Alan",
    lastName: "Turing",
    role: "lecturer",
};

const mockKpis = {
    averageRating: 4.6,
    activeStudents: 134,
    responseRate: 88,
};

const mockCourses = [
    { id: 101, name: "Introduction to Artificial Intelligence", code: "CS-401", department: "Computer Science", semester: "Fall", year: 2023 },
    { id: 102, name: "Theory of Computation", code: "CS-402", department: "Computer Science", semester: "Fall", year: 2023 },
    { id: 103, name: "Advanced Cryptography", code: "CS-650", department: "Computer Science", semester: "Spring", year: 2024 },
];

const mockFeedbackResponses = [
    {
        id: 1,
        courseId: 101,
        course: mockCourses[0], // Add course object for easy access
        responses: { q1: 5, q2: 5, q3: 4 },
        comments: "Professor Turing makes difficult concepts easy to understand. The best course I've taken so far!",
        submittedAt: "2023-11-20T10:00:00Z",
    },
    {
        id: 2,
        courseId: 102,
        course: mockCourses[1],
        responses: { q1: 4, q2: 5, q3: 5 },
        comments: "The material on Turing machines was fascinating. I wish there were more practical examples.",
        submittedAt: "2023-11-18T14:30:00Z",
    },
    {
        id: 3,
        courseId: 101,
        course: mockCourses[0],
        responses: { q1: 5, q2: 4, q3: 4 },
        comments: "", // No comment provided
        submittedAt: "2023-11-15T09:00:00Z",
    },
    {
        id: 4,
        courseId: 103,
        course: mockCourses[2],
        responses: { q1: 4, q2: 4, q3: 3 },
        comments: "The math was a bit intense, but the lecturer was always available to help during office hours.",
        submittedAt: "2024-04-10T11:00:00Z",
    },
];
// --- END MOCK DATA ---


export default function LecturerDashboard() {
    // Use mock data directly instead of hooks
    const user1 = mockUser;
    const courses = mockCourses;
    const feedbackResponses = mockFeedbackResponses;
    const kpis = mockKpis;
    const { user } = useUserStore();

    const {showErrorToast } = useToast();

    const { data: dash, isLoading: loadingOverview, error: errorOverview } = useLecturerDashboardOverviewQuery(String(user?.id));
    const { data: sessions, isLoading: loadingSessions, error: sessionError } = useActiveSession();
    const { data: feedbacks, isLoading: feedbackloading, error: feedbackserror } =  useRecentFeedbacks(String(user?.id));

    const sessionId = sessions?.[0]?.sessionId;
    const findCurrentSession = sessions?.find((session)=> session.isCurrent);

    const {
        data: coursePerformance,
        isLoading: courseLoading,
        error: courseError
    } = useLecturerCoursePerformance(String(user?.id), sessionId??0);

    if (errorOverview) showErrorToast("Failed to load dashboard overview.");
    if (sessionError) showErrorToast("Failed to fetch sessions.");
    if (courseError) showErrorToast("Failed to fetch courses performance for this semester.");


    return (

            <div className="space-y-6">
                {/* Welcome Header */}

                <div className="bg-gradient-to-r  flex justify-between items-center from-green-600 to-blue-600 text-white rounded-lg p-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            Welcome, {dash?.lecturerName} {user?.id}
                        </h1>
                        <p className="text-green-100">
                            Your teaching performance overview and student feedback insights.
                        </p>


                    </div>
                    {findCurrentSession && (
                       <div className={"flex gap-2 max-h-9"}>
                           <Badge>
                               {findCurrentSession.semesterName}
                           </Badge>
                           <Badge>
                               start {findCurrentSession.startDate}
                           </Badge>

                           <Badge>
                               end: {findCurrentSession.endDate}
                           </Badge>
                       </div>
                    )}
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                            <Star className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{dash?.averageRating || 0}/5</div>
                            <p className="text-xs text-muted-foreground">
                                Based on all feedback
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{dash?.totalStudentsTaught}</div>
                            <p className="text-xs text-muted-foreground">
                                Active this semester
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{dash?.activeStudents || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                Enrolled across courses
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{dash?.activeSemesterResponseRate || 0}%</div>
                            <p className="text-xs text-muted-foreground">
                                Feedback participation
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Feedback Distribution</CardTitle>
                            <CardDescription>
                                Distribution of ratings across all feedback criteria
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FeedbackDistributionChart />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Rating Trends</CardTitle>
                            <CardDescription>
                                Average ratings over time across all courses
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RatingTrendsChart />
                        </CardContent>
                    </Card>
                </div>

                {/* Courses Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            My Courses
                        </CardTitle>
                        <CardDescription>
                            Overview of your courses and their feedback status
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {coursePerformance?.map((course, index) => {
                                const averageRating = parseFloat(course.rating);

                                return (
                                    <div key={index} className="p-4 border rounded-lg">
                                        <h4 className="font-medium">{course.courseName}</h4>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            {course.courseCode} • {course.departmentName}
                                        </p>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Badge variant="secondary">{course.semesterName}</Badge>
                                            <Badge variant={course.numberOfReviews > 0 ? "default" : "outline"}>
                                                {course.numberOfReviews} Reviews
                                            </Badge>
                                        </div>
                                        {averageRating > 0 && (
                                            <div className="flex items-center gap-2">
                                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                <span className="text-sm font-medium">
                {averageRating.toFixed(1)}/5
              </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>

                </Card>

                {/* Recent Feedback */}
                {feedbacks && feedbacks.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                Recent Feedback
                            </CardTitle>
                            <CardDescription>
                                Latest student feedback on your courses
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {feedbacks.slice(0, 5).map((response) => {
                                    const averageRating = parseFloat(response.rating);

                                    return (
                                        <div key={response.submittedAt + response.courseName} className="p-4 border rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium">{response.courseName}</h4>
                                                <div className="flex items-center gap-2">
                                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                    <span className="text-sm font-medium">{averageRating.toFixed(1)}/5</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                Submitted on {new Date(response.submittedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}

            </div>

    );
}