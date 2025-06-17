import {Faculty} from "@/lib/types/faculty";
import {Course} from "@/lib/types/course";

export interface Department {
    id: string;
    name: string;
    faculty?:Faculty;
}

export interface DepartmentWithCourses{
    id: string;
    name: string;
    faculty_id: string;
    courses:Course[]
}

