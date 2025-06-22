// In /lib/types.ts

// These types represent what you SEND to the API
import {CourseOffering} from "@/lib/types/course-offering";
import {Course} from "@/lib/types/course";
import {Lecturer} from "@/lib/types/lecturer";

export interface QuestionCreatePayload {
    question_text: string;
    question_type: 'text' | 'slider' | 'rating';
    order: number;
    criteria_id: number;
}

export interface QuestionnaireCreatePayload {
    title: string;
    status: 'active' | 'inactive' | 'draft';
    course_offering_id: number;
    feedback_round: number;
    questions: QuestionCreatePayload[];
}

// Your existing types represent what you GET FROM the API
export interface Question {
    id: number;
    questionnaire_id: number;
    order: number;
    question_text?: string;
    question_type: 'text' | 'slider' | 'rating';
    criteria_id?: number;
    created_at?: string;
}

export interface Questionnaire {
    id: number;
    title: string;
    status: 'active' | 'inactive';
    course_offering:CourseOffering;
    questions?: Question[];
    created_at: string;
    feedback_round: number;
    feedback_count:number;
}

export interface ResponseQuestionnaire {
    questionnaire_id: number;
    title: string;
    status: 'active' | 'inactive';
    course_offering: CourseOffering;
    course:Course;
    lecturer:Lecturer

}





