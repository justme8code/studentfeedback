'use server';

import {makeAuthRequest} from "@/lib/api/session";
import {CourseOfferingWithDetails} from "@/lib/types/course-offering";

export async function createCourseOfferings(lecturer_id: string, course_id: string, semester_id: string) {
    const { data, status, error } = await makeAuthRequest<[{lecturer_id:string,course_id:string,semester_id:string}],null>({
        method: "POST",
        url: `/course-offerings/batch`,
        data: [{ lecturer_id, course_id,semester_id }]
    });
    return { data, status: status === 201, error };
}

export async function getAllCourseOfferingsByLecturerId(lecturer_id: string) {
    const { data, status, error } = await makeAuthRequest<null,CourseOfferingWithDetails[]>({
        method: "GET",
        url: `/course-offerings/lecturer/${lecturer_id}`,
    });
    return { data, status: status === 200, error };
}

