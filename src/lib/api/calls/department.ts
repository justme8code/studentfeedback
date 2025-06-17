'use server';
import { makeAuthRequest } from "@/lib/api/session";
import {Department, DepartmentWithCourses} from "@/lib/types";

export async function fetchAllDepartments() {
    const { data, status, error } = await makeAuthRequest<null, Department[]>({
        method: "GET",
        url: "/departments"
    });
    return { data, status: status === 200, error };
}

export async function createDepartments(departments: Partial<Department>[]) {
    const { data, status, error } = await makeAuthRequest<Partial<Department>[], Department[]>({
        method: "POST",
        url: "/departments/batch",
        data: departments
    });
    return { data, status: status === 201, error };
}

export async function deleteDepartment(id: string) {
    const { data, status, error } = await makeAuthRequest<null, null>({
        method: "DELETE",
        url: `/departments/${id}`
    });
    return { data, status: status === 200, error };
}

export async function getDepartmentsWithCourses() {
    const { data, status, error } = await makeAuthRequest<null, DepartmentWithCourses[]>({
        method: "GET",
        url: `/departments/with-courses`
    });
    return { data, status: status === 200, error };
}


export async function assignCourseToDepartment(department_id: string,course_id: string) {
    const { data, status, error } = await makeAuthRequest<{department_id:string,course_id:string},null>({
        method: "POST",
        url: `/departments/courses/assign`,
        data: { department_id, course_id }
    });
    return { data, status: status === 201, error };
}

export async function removeCourseFromDepartment(department_id: string,course_id: string) {
    const { data, status, error } = await makeAuthRequest<{department_id:string,course_id:string},null>({
        method: "POST",
        url: `/departments/courses/remove`,
        data: { department_id, course_id }
    });
    return { data, status: status === 200, error };
}

