'use server';

import {makeAuthRequest} from "@/lib/api/session";
import {CourseOfferingWithDetails} from "@/lib/types/course-offering";

type r = {lecturer_id:number,course_id:string,semester_id:string,id?:string};
export async function createCourseOfferings(lecturer_id: number, course_id: string, semester_id: string) {
    const { data, status, error } = await makeAuthRequest<r[],{success:r[],duplicates:r[]}>({
        method: "POST",
        url: `/course-offerings/batch`,
        data: [{ lecturer_id, course_id,semester_id }]
    });
    return { successData:data?.success??[],duplicatesData:data?.duplicates??[], status: status === 201, error };
}

export async function getAllCourseOfferingsByLecturerId(lecturer_id: number) {
    const { data, status, error } = await makeAuthRequest<null,CourseOfferingWithDetails[]>({
        method: "GET",
        url: `/course-offerings/lecturer/${lecturer_id}`,
    });
    return { data, status: status === 200, error };
}

export async function unAssignCourseByIds(ids: string[]) {
    const { data, status, error } = await makeAuthRequest<string[], null>({
        method: "DELETE",
        url: `/course-offerings`,
        data: ids
    });
    return { data, status: status === 200, error };
}

