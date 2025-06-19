import {LecturerProfile, StudentProfile} from "@/lib/types/profile";

export interface User {
    id?: number;
    full_name: string;
    email: string;
    role_id: number;
    created_at: string;
    updated_at: string;
    profile:StudentProfile|LecturerProfile|null;
}
