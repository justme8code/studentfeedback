'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, TrendingUp, Settings, Plus, Star, BarChart3 } from "lucide-react";

import { useDashboardOverviewQuery } from "@/lib/hooks/kpi/useDashboardOverviewQuery";

import { useToast } from "@/lib/hooks/use-toast-store";
import {useLecturerPerformanceQuery} from "@/lib/hooks/kpi/useLecturerPerformanceQuery";

const mockFeedbackRounds = [
  {
    id: 1,
    name: "Mid-term Evaluation 2023",
    description: "Feedback for the first half of the semester.",
    startDate: "2023-10-01",
    endDate: "2023-10-15",
    isActive: true,
  },
  {
    id: 2,
    name: "End-of-Semester Evaluation 2023",
    description: "Final feedback for all courses.",
    startDate: "2023-12-01",
    endDate: "2023-12-15",
    isActive: true,
  },
  {
    id: 3,
    name: "Spring Preregistration Feedback 2023",
    description: "Early feedback for course planning.",
    startDate: "2023-04-01",
    endDate: "2023-04-15",
    isActive: false,
  },
];

const mockFeedbackCriteria = [
  { id: 1, name: "Teaching Clarity", description: "Clarity of explanations and lectures.", weight: 30, isActive: true },
  { id: 2, name: "Course Material", description: "Relevance and quality of materials.", weight: 25, isActive: true },
  { id: 3, name: "Assessment Fairness", description: "Fairness of exams and assignments.", weight: 25, isActive: true },
  { id: 4, name: "Engagement", description: "Lecturer's ability to engage students.", weight: 20, isActive: true },
  { id: 5, name: "Legacy Criterion", description: "An old, disabled criterion.", weight: 0, isActive: false },
];

const Link = ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: any }) => (
    <a href={href} {...props}>{children}</a>
);

export default function AdminDashboard() {
  const activeRounds = mockFeedbackRounds.filter((round) => round.isActive);
  const {showErrorToast } = useToast();

  const { data: dashboardOverview, isLoading: loadingOverview, error: errorOverview } = useDashboardOverviewQuery();
  const { data: lecturerPerformance, isLoading: loadingLecturers, error: errorLecturers } = useLecturerPerformanceQuery();

  if (errorOverview) showErrorToast("Failed to load dashboard overview.");
  if (errorLecturers) showErrorToast("Failed to load lecturer performances.");

  return (

        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-6">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-purple-100">System overview and management tools for the feedback system.</p>
          </div>

          {/* System Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Lecturers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardOverview?.totalLecturers ?? '...'}</div>
                <p className="text-xs text-muted-foreground">Active faculty members</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardOverview?.totalStudents ?? '...'}</div>
                <p className="text-xs text-muted-foreground">Enrolled students</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Rounds</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeRounds.length}</div>
                <p className="text-xs text-muted-foreground">Currently collecting feedback</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardOverview?.responseRate ?? '...'}</div>
                <p className="text-xs text-muted-foreground">Overall participation</p>
              </CardContent>
            </Card>
          </div>

          {/* Lecturer Performance Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Lecturer Performance Overview</CardTitle>
              <CardDescription>Summary of lecturer ratings and feedback statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lecturerPerformance?.slice(0, 5).map((performance, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{performance.lecturerName}</h4>
                        <p className="text-sm text-muted-foreground">{performance.department} • {performance.numberOfCourses} courses</p>
                        <div className="flex flex-wrap items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm">{ Number(performance.averageRating).toFixed(1)}/5</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{performance.numberOfReviews} reviews</span>
                        </div>
                      </div>
                      <Badge variant={
                        Number(performance.averageRating) >= 4.0 ? "default" :
                            Number(performance.averageRating) >= 3.0 ? "secondary" : "destructive"
                      }>
                        {Number(performance.averageRating) >= 4.0 ? "Excellent" :
                            Number(performance.averageRating)>= 3.0 ? "Good" : "Needs Improvement"}
                      </Badge>
                    </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
  );
}
