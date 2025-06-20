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

export interface ActiveSession {
    sessionId:number;
    sessionName:string;
    sessionStatus:string;
    sessionActive:boolean;
    semesterId:number;
    semesterName:string;
    startDate:string;
    endDate:string;
    isCurrent:boolean;
}