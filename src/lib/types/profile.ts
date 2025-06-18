import {Department} from "@/lib/types/department";

export interface StudentProfile {
    user_id: string;
    matric_number: string;
    department_id: string;
    level: string;
    faculty_id: string;
}

export interface LecturerProfile {
    user_id: string;
    department:Department;
}

