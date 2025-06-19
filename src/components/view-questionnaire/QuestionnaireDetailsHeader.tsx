// src/components/view-questionnaire/QuestionDetailsHeader.tsx

import { Questionnaire2 } from "@/lib/schema";
import { BookUser, CalendarDays, CheckCircle, UserCircle, XCircle } from "lucide-react";

export default function QuestionDetailsHeader({ questionnaire }: { questionnaire: Questionnaire2 }) {
    const isActive = questionnaire.status === 'active';
    return (
        // Changed from <Card> to a styled <div>
        <div className="p-6 bg-white border border-slate-200 rounded-lg">
            <h1 className="text-3xl font-bold text-slate-800">{questionnaire.title}</h1>
            <div className="flex items-center gap-2 pt-2">
                {isActive ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                <span className={`font-semibold ${isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {questionnaire.status.charAt(0).toUpperCase() + questionnaire.status.slice(1)}
                </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 pt-4 border-t mt-4">
                <div className="flex items-center gap-2"><BookUser className="h-4 w-4" /><span>{questionnaire.course_offering.course.course_code}: {questionnaire.course_offering.course.course_title}</span></div>
                <div className="flex items-center gap-2"><UserCircle className="h-4 w-4" /><span>{questionnaire.course_offering.lecturer.full_name}</span></div>
                <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /><span>{questionnaire.course_offering.semester.name}</span></div>
            </div>
        </div>
    );
}