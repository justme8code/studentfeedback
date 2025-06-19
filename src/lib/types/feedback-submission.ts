export type FeedbackSubmission = {
    submission_id: number;
    submitted_at: string; // ISO datetime as string
    questionnaire: {
        id: number;
        title: string;
        course: {
            course_code: string;
            course_title: string;
        };
        lecturer: {
            full_name: string;
        };
    };
};
