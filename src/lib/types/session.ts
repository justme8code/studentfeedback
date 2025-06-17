import { Semester } from "./semester";

export interface Session {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    status: string;
    is_active: boolean;
    semesters: Semester[];
}