import {Course} from "@/lib/types/course";
import {Semester} from "@/lib/types/semester";
import {Lecturer} from "@/lib/types/lecturer";

export interface CourseOffering {
    course_id:string;
    semester_id:string;
    lecturer_id:string;
}

export interface  CourseOfferingWithDetails {
    course:Course;
    semester:Semester;
    lecturer:Lecturer;
}