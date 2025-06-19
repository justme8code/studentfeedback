export interface Course {
    id: string;
    course_title: string;
    course_code: string;
    level: string;
    current_offering: {
        lecturer_id: number,
        lecturer_name: string
    }
}