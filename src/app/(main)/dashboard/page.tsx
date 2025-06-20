"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MessageSquarePlus,
  Edit3,
  CheckCircle2, BookOpen, Clock, MessageSquare,
} from "lucide-react";
import { useUserStore } from "@/lib/hooks/useUserStore";
import {
  feedbackSubmissions,
  getPendingQuestionnairesById,
} from "@/lib/api/calls/questionnaire";
import { ResponseQuestionnaire } from "@/lib/types/questionnaire";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getStudentCourse } from "@/lib/api/calls/course";
import { Course } from "@/lib/types";
import { FeedbackSubmission } from "@/lib/types/feedback-submission";

export default function DashboardPage() {
  const { user } = useUserStore();
  const [coursesPendingFeedback, setCoursesPendingFeedback] = useState<ResponseQuestionnaire[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [submittedFeedbacks, setSubmittedFeedbacks] = useState<FeedbackSubmission[]>([]);

  const handleGetCourses = useCallback(async () => {
    if (user?.id) {
      const { data } = await getStudentCourse(user?.id);
      setEnrolledCourses(data || []);
    }
  }, [user?.id]);

  const handleGetFeedbackSubmissions = useCallback(async () => {
    if (user?.id) {
      const { data } = await feedbackSubmissions(user.id);
      setSubmittedFeedbacks(data || []);
    }
  }, [user?.id]);

  const handleGetPendingFeedback = useCallback(async () => {
    const { data } = await getPendingQuestionnairesById(Number(user?.id));
    setCoursesPendingFeedback(data?.data || []);
  }, [user?.id]);

  useEffect(() => {
    handleGetPendingFeedback();
    handleGetCourses();
    handleGetFeedbackSubmissions();
  }, [handleGetCourses, handleGetFeedbackSubmissions, handleGetPendingFeedback]);

  // 👇 Safe fallback initials for Avatar
  const userName = typeof user?.full_name === "string"
      ? user.full_name
      : (user?.full_name || "U");

  return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-10">
        {/* Header */}


        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.full_name}!
          </h1>
          <p className="text-blue-100">
            You have {coursesPendingFeedback.length} pending feedback {coursesPendingFeedback.length === 1 ? 'form' : 'forms'} to complete.
          </p>
        </div>



        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrolledCourses.length}</div>
              <p className="text-xs text-muted-foreground">
                Active this semester
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Feedback</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{coursesPendingFeedback.length}</div>
              <p className="text-xs text-muted-foreground">
                Forms waiting for completion
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Submitted Feedback</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submittedFeedbacks.length}</div>
              <p className="text-xs text-muted-foreground">
                Completed this semester
              </p>
            </CardContent>
          </Card>
        </div>

        {/* === Pending Feedback Section === */}
        {coursesPendingFeedback && coursesPendingFeedback.length > 0 && (
            <section className="mb-10">
              <h2 className="text-2xl font-semibold tracking-tight mb-4 flex items-center">
                <MessageSquarePlus className="mr-2 h-6 w-6 text-primary" />
                Courses Requiring Your Feedback
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {coursesPendingFeedback.map((pending) => (
                    <Card key={pending.questionnaire_id} className="flex flex-col justify-between shadow-sm border rounded-lg">
                      <CardHeader>
                        <CardTitle className="text-lg">{pending.title}</CardTitle>
                        <CardDescription>
                          {pending.course.course_title} – {pending.course.course_code} – {pending.lecturer.full_name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">
                          Your feedback is important! Please share your thoughts on this course.
                        </p>
                        <Badge variant="destructive">Pending</Badge>
                      </CardContent>
                      <CardFooter>
                        <Button asChild variant="outline" className="w-full">
                          <Link href={`/feedbacks/submit/${pending.questionnaire_id}`} className="flex items-center justify-center w-full">
                            <Edit3 className="mr-2 h-4 w-4" /> Give Feedback
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                ))}
              </div>
            </section>
        )}



        {/* === Enrolled Courses Section === */}
        {enrolledCourses.length > 0 && (
            <section className="mb-10">
              <h2 className="text-2xl font-semibold tracking-tight mb-4">
                Enrolled Courses
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {enrolledCourses.map(({ id, course_title, course_code, current_offering }) => (
                    <Card key={id} className="flex flex-col shadow-sm border rounded-lg">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold">
                          {course_title}
                        </CardTitle>
                        <CardDescription className="space-y-1 text-sm mt-2">
                          <p><span className="font-medium">Course Code:</span> {course_code}</p>
                          {current_offering && (  <p><span className="font-medium">Lecturer:</span> {current_offering.lecturer_name}</p>)}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                ))}
              </div>
            </section>
        )}

        {/* === Submitted Feedback Section === */}
        {submittedFeedbacks && submittedFeedbacks.length > 0 && (
            <section className="mb-10">
              <h2 className="text-2xl font-semibold tracking-tight mb-4 flex items-center">
                <CheckCircle2 className="mr-2 h-6 w-6 text-green-600" />
                Feedback Submitted
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {submittedFeedbacks.map((sf) => {
                  const { questionnaire } = sf;
                  const { course, lecturer } = questionnaire;
                  return (
                      <Card key={questionnaire.title} className="flex flex-col shadow-sm border rounded-lg">
                        <CardHeader>
                          {course && (
                              <CardTitle className="text-base font-semibold flex justify-between items-center">

                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                  Submitted
                                </Badge>
                              </CardTitle>
                          )}
                          <CardDescription className="mt-1 text-sm">
                            {
                              course && (
                                <div>
                                  <p><span className="font-medium">Course Code:</span> {course.course_code}</p>
                                  <p><span className="font-medium">Lecturer:</span> {lecturer.full_name}</p>
                                </div>
                                )
                            }
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <p className="text-sm text-muted-foreground">
                            Thank you for submitting your feedback for this course.
                          </p>
                        </CardContent>
                      </Card>
                  );
                })}
              </div>
            </section>
        )}
      </div>
  );
}
