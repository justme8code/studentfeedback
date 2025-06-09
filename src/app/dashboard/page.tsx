"use client"; // Required for client-side interactivity if any (e.g., future state changes)

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
import { BookOpen, MessageSquarePlus, Edit3, CheckCircle2 } from "lucide-react"; // Icons

// --- Mock Data ---
// In a real app, this would come from your API after login
const studentData = {
  fullName: "Isabella Wonderland",
  avatarUrl: "https://github.com/shadcn.png", // Placeholder avatar
  initials: "AW",
};

const enrolledCourses = [
  {
    id: "crs101",
    code: "CS101",
    name: "Introduction to Programming",
    instructor: "Dr. Alan Turing",
    feedbackSubmitted: false,
    semester: "Fall 2023",
  },
  {
    id: "crs202",
    code: "MAT202",
    name: "Calculus II",
    instructor: "Dr. Ada Lovelace",
    feedbackSubmitted: true,
    semester: "Fall 2023",
  },
  {
    id: "crs305",
    code: "PHY305",
    name: "Modern Physics",
    instructor: "Dr. Marie Curie",
    feedbackSubmitted: false,
    semester: "Spring 2024",
  },
  {
    id: "crs410",
    code: "ENG410",
    name: "Advanced Literature",
    instructor: "Prof. William Shakespeare",
    feedbackSubmitted: false,
    semester: "Spring 2024",
  },
];
// --- End Mock Data ---

export default function DashboardPage() {
  const handleGiveFeedback = (courseId: string, courseName: string) => {
    // In a real app, this would navigate to the feedback form for the course
    // e.g., router.push(`/feedback/submit/${courseId}`);
    alert(`Navigate to feedback form for: ${courseName} (ID: ${courseId})`);
  };

  const handleViewFeedback = (courseId: string, courseName: string) => {
    // In a real app, this would navigate to view the submitted feedback
    // e.g., router.push(`/feedback/view/${courseId}`);
    alert(`Navigate to view feedback for: ${courseName} (ID: ${courseId})`);
  };

  const coursesPendingFeedback = enrolledCourses.filter(c => !c.feedbackSubmitted);
  const coursesWithFeedback = enrolledCourses.filter(c => c.feedbackSubmitted);

  return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={studentData.avatarUrl} alt={studentData.fullName} />
              <AvatarFallback>{studentData.initials}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome, {studentData.fullName}!
              </h1>
              <p className="text-muted-foreground">
                {"Here's an overview of your courses and feedback status."}
              </p>
            </div>
          </div>
          {/* Optional: Quick actions or summary stats */}
          {/* <div className="flex space-x-2">
          <Button variant="outline">View Profile</Button>
          <Button>Quick Action</Button>
        </div> */}
        </div>

        <Separator className="my-6" />

        {/* Courses Requiring Feedback Section */}
        {coursesPendingFeedback.length > 0 && (
            <section className="mb-10">
              <h2 className="text-2xl font-semibold tracking-tight mb-4 flex items-center">
                <MessageSquarePlus className="mr-2 h-6 w-6 text-primary" />
                Courses Requiring Your Feedback
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {coursesPendingFeedback.map((course) => (
                    <Card key={course.id} className="flex flex-col">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {course.name}
                          <Badge variant="destructive">Pending</Badge>
                        </CardTitle>
                        <CardDescription>
                          {course.code} - {course.instructor} ({course.semester})
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground">
                          Your feedback is important! Please share your thoughts on this course.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button
                            className="w-full"
                            onClick={() => handleGiveFeedback(course.id, course.name)}
                        >
                          <Edit3 className="mr-2 h-4 w-4" /> Give Feedback
                        </Button>
                      </CardFooter>
                    </Card>
                ))}
              </div>
            </section>
        )}

        {/* Courses with Submitted Feedback Section */}
        {coursesWithFeedback.length > 0 && (
            <section className="mb-10">
              <h2 className="text-2xl font-semibold tracking-tight mb-4 flex items-center">
                <CheckCircle2 className="mr-2 h-6 w-6 text-green-600" />
                Feedback Submitted
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {coursesWithFeedback.map((course) => (
                    <Card key={course.id} className="flex flex-col">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {course.name}
                          <Badge variant="secondary" className="bg-green-100 text-green-700">Submitted</Badge>
                        </CardTitle>
                        <CardDescription>
                          {course.code} - {course.instructor} ({course.semester})
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground">
                          Thank you for submitting your feedback for this course.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => handleViewFeedback(course.id, course.name)}
                        >
                          <BookOpen className="mr-2 h-4 w-4" /> View My Feedback
                        </Button>
                      </CardFooter>
                    </Card>
                ))}
              </div>
            </section>
        )}

        {/* Empty State: No courses enrolled */}
        {enrolledCourses.length === 0 && (
            <div className="mt-10 flex flex-col items-center justify-center text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">No Courses Found</h3>
              <p className="text-muted-foreground">
                It seems you are not enrolled in any courses currently, or there are no courses available for feedback.
              </p>
              {/* Optional: Link to browse courses or contact support */}
            </div>
        )}
      </div>
  );
}