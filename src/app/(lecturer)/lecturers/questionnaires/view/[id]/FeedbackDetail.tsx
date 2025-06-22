// components/FeedbackDetail.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {BookUser, CalendarDays, CheckCircle, Clock, Hourglass, MessageCircle, Star, UserCircle} from "lucide-react";
import {StarRating} from "@/app/(lecturer)/lecturers/questionnaires/view/[id]/StarRating";
import {FeedbackResponse} from "@/lib/types/view_questionnaire";

// Best practice: Define types in a dedicated file, e.g., types/feedback.ts
// But keeping it here for simplicity.


const statusVariantMap: { [key in FeedbackResponse["status"]]: "default" | "secondary" | "outline" } = {
    Completed: "default",
    "In Progress": "secondary",
    Pending: "outline",
};

type StatusConfig = {
    icon: React.ElementType; // A generic type for any React component
    className: string;
};

// Use the `Record` utility type to link the keys to the status type
// This tells TypeScript: "This object will have a key for every possible
// value in FeedbackResponse['status'], and the value will be a StatusConfig object."
const statusConfig: Record<FeedbackResponse["status"], StatusConfig> = {
    Completed: {
        icon: CheckCircle,
        className: "text-green-500",
    },
    "In Progress": {
        icon: Clock,
        className: "text-blue-500",
    },
    Pending: {
        icon: Hourglass,
        className: "text-amber-500",
    },
};
// Sub-component for the Header for better readability
const FeedbackDetailHeader = ({ data }: { data: FeedbackResponse }) => {
    const currentStatus = statusConfig[data.status] ?? statusConfig.Pending;
    const IconComponent = currentStatus.icon;

    return (
        // Replicates the style of the example component
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold text-slate-800">{data.title}</h1>

            {/* Status display with icon and colored text */}
            <div className="flex items-center gap-2 pt-2">
                <IconComponent className={`h-5 w-5 ${currentStatus.className}`} />
                <span className={`font-semibold ${currentStatus.className}`}>
          {data.status}
        </span>
            </div>

            {/* Metadata section with icons, separated by a border */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600 pt-4 border-t mt-4">
                <div className="flex items-center gap-2" title="Course">
                    <BookUser className="h-4 w-4 text-slate-400" />
                    <span>
            {data.course_offering.course.course_code} - {data.course_offering.course.course_title}
          </span>
                </div>
                <div className="flex items-center gap-2" title="Lecturer">
                    <UserCircle className="h-4 w-4 text-slate-400" />
                    <span>{data.course_offering.lecturer.full_name}</span>
                </div>
                <div className="flex items-center gap-2" title="Semester">
                    <CalendarDays className="h-4 w-4 text-slate-400" />
                    <span>{data.course_offering.semester.name}</span>
                </div>
            </div>
        </div>
    );
};


// Sub-component for a single Criteria Group
const CriteriaGroupSection = ({ group }: { group: FeedbackResponse["criteria_groups"][0] }) => (
    <div className="space-y-3">
        <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base">{group.name}</h3>
            <StarRating rating={group.performance} showValue />
        </div>
        <ul className="space-y-2 pl-2 border-l-2">
            {group.questions.map((q) => (
                <li key={q.id} className="text-sm flex items-start gap-3 ml-2">
          <span className="mt-1 text-muted-foreground">
            {q.question_type === "rating" ? (
                <Star className="w-4 h-4" />
            ) : (
                <MessageCircle className="w-4 h-4" />
            )}
          </span>
                    <span className="flex-1">{q.question_text}</span>
                </li>
            ))}
        </ul>
    </div>
);

// Main Component
export const FeedbackDetail = ({ data }: { data: FeedbackResponse }) => {
    const overallPerformanceValue = parseFloat(data.overall_performance);

    return (
        <Card className="shadow-sm border"> {/* Reduced shadow and added border */}
            <FeedbackDetailHeader data={data} />
            <CardContent className="space-y-6">
                {/* Overall Performance Section */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <h3 className="text-base font-medium">Overall Performance</h3>
                        <span className="text-sm font-semibold text-foreground">
              {overallPerformanceValue.toFixed(1)}%
            </span>
                    </div>
                    <Progress value={overallPerformanceValue} className="h-2" />
                </div>

                <Separator />

                {/* Criteria Groups Section */}
                <div className="space-y-6">
                    {data.criteria_groups.map((group) => (
                        <CriteriaGroupSection key={group.id} group={group} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};