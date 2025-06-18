import {Course} from "@/lib/types/course";
import {Semester} from "@/lib/types/semester";
import {Lecturer} from "@/lib/types/lecturer";

export interface CourseOffering {
    course_id:string;
    course_code:string;
    course_title:string;
}

export interface CourseOfferingWithDetails {
    id: number;
    course: Course;
    lecturer: Lecturer;
    semester: Semester;
    created_at: string;
    updated_at: string;
}