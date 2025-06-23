import {LecturerProfile, StudentProfile} from "@/lib/types/profile";
import {Department} from "@/lib/types/department";

export interface User {
    id?: number;
    full_name: string;
    email: string;
    department?: Department;
    role_id: number;
    created_at: string;
    updated_at: string;
    profile:StudentProfile|LecturerProfile|null;
}
