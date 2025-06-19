export interface Feedback {
    question_id: number;
    answer_text?: string;
    answer_value?: number;
}


export interface FeedbackSubmissionPayload {
    questionnaire_id: number;
    answers: {
        question_id: number;
        answer_text?: string;
        answer_value?: number;
    }[];
}