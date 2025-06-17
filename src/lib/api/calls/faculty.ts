'use server';
import {makeAuthRequest} from "@/lib/api/session";
import {Faculty} from "@/lib/types";

export async function fetchAllFaculties() {
    const {data, status, error} = await makeAuthRequest<null, Faculty[]>({
        method: "GET",
        url: "/faculties"
    });
    return {data, status: status === 200, error};
}


export async function createFaculties(faculties: Partial<Faculty>[]) {
    const {data, status, error} = await makeAuthRequest<Partial<Faculty>[], Faculty[]>({
        method: "POST",
        url: "/faculties/batch",
        data: faculties
    });

    console.log(data);
    return {data, status: status === 201, error};
}

export async function deleteFaculty(id: string) {
    const {data, status, error} = await makeAuthRequest<null, null>({
        method: "DELETE",
        url: `/faculties/${id}`
    });
    return {data, status: status === 200, error};
}

export async function getFacultiesWithDepartments() {
    const {data, status, error} = await makeAuthRequest<null, Faculty[]>({
        method: "GET",
        url: `/faculties/with-departments`
    });
    return {data, status: status === 200, error};
}


