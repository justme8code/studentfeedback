
export type FeedbackResponse = {
    id: number;
    title: string;
    status: string;
    overall_performance: string;
    course_offering: {
        id: number;
        course: { id: number; course_code: string; course_title: string };
        lecturer: { id: number; full_name: string };
        semester: { id: number; name: string };
    };
    created_by_user_id: number;
    criteria_groups: {
        id: number;
        name: string;
        performance: number;
        questions: {
            id: number;
            question_text: string;
            question_type: "rating" | "text";
            order: number;
            criterion: { id: number; name: string };
        }[];
    }[];
};