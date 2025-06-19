'use server';
import { makeAuthRequest } from "@/lib/api/session";
import {Course} from "@/lib/types";
import {PaginatedData} from "@/lib/types/paginated";

export async function createCourse(course: Partial<Course>) {
    const { data, status, error } = await makeAuthRequest<Partial<Course>, Course>({
        method: "POST",
        url: "/courses",
        data: course
    });
    return { data, status: status === 201, error };
}


export async function getAllCourses() {
    const { data, status, error } = await makeAuthRequest<null, Course[]>({
        method: "GET",
        url: "/courses"
    });
    return { data, status: status === 200, error };
}

export async function getCourse(id:number) {
    const { data, status, error } = await makeAuthRequest<null, Course>({
        method: "POST",
        url: `/courses/${id}`
    });
    return { data, status: status === 201, error };
}

export async function updateCourse(id: string, data: Partial<Course>) {
    const res = await makeAuthRequest<Partial<Course>, Course>({
        method: "PUT",
        url: `/courses/${id}`,
        data,
    });
    return { data: res.data, status: res.status === 200, error: res.error };
}

export async function getStudentCourse(id: number) {
    const {data,status,error} = await makeAuthRequest<null, PaginatedData<Course>>({
        method: "GET",
        url: `/users/students/${id}/courses`
    });
    return { data: data?.data, status: status === 200, error: error.message};
}
