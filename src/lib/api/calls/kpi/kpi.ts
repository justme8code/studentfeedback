'use server';

import {makeAuthRequest} from "@/lib/api/session";
import {
    DashboarOverview,
    LecturerCoursePerformance,
    LecturerDashboardOverview,
    LecturerPerformance
} from "@/lib/types/kpi";

export async function fetchDashBoardOverview() {
    const { data, status, error } = await makeAuthRequest<null, DashboarOverview>({
        method: "GET",
        url: `/kpis/admin`
    });
    return { data, status: status === 200, error };
}

export async function fetchLecturerPerformances() {
    const { data, status, error } = await makeAuthRequest<null,LecturerPerformance[]>({
        method: "GET",
        url: `/kpis/admin/lecturer-performance`
    });
    return { data, status: status === 200, error };
}


    export async function fetchLecturerOverView(lecturerId:string) {
        const { data, status, error } = await makeAuthRequest<null,LecturerDashboardOverview>({
            method: "GET",
            url: `/kpis/lecturers/${lecturerId}`,
        });
        console.log(data);
        return { data, status: status === 200, error };
    }


export async function fetchLecturerCoursesPerformanceBySession(lecturerId:string,sessionId:number) {
    const { data, status, error } = await makeAuthRequest<null,LecturerCoursePerformance[]>({
        method: "GET",
        url: `/kpis/lecturers/${lecturerId}/lecturers-courses-by-session/${sessionId}`,
    });

    return { data, status: status === 200, error };
}