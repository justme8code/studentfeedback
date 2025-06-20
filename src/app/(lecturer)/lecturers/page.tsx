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
import {useRecentTextFeedbacks} from "@/lib/hooks/kpi/useRecentTextFeedbacks";


export default function LecturerDashboard() {

    const { user } = useUserStore();

    const {showErrorToast } = useToast();

    const { data: dash, isLoading: loadingOverview, error: errorOverview } = useLecturerDashboardOverviewQuery(String(user?.id));
    const { data: sessions, isLoading: loadingSessions, error: sessionError } = useActiveSession();
    const { data: feedbacks, isLoading: feedbackloading, error: feedbackserror } =  useRecentTextFeedbacks(String(user?.id));

    const sessionId = sessions?.[0]?.sessionId;
    const findCurrentSession = sessions?.find((session)=> session.isCurrent);

    console.log(feedbacks);
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
                                {feedbacks.map((response, index) => (
                                    <div key={response.submittedAt + response.courseName} className="p-4 border rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-medium">{response.courseName}</h4>
                                            <div className="flex items-center gap-2">
                                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                <span className="text-sm font-medium">{response.rating}/5</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Submitted on {new Date(response.submittedAt).toLocaleDateString()}
                                        </p>
                                        {response.feedbackText && (
                                            <p className="text-sm bg-muted p-3 rounded-lg italic">
                                                "{response.feedbackText}"
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}


            </div>

    );
}