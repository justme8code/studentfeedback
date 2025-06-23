'use server';
import {makeAuthRequest} from "@/lib/api/session";
import type { User } from "@/lib/types/user";
import {Questionnaire} from "@/lib/types/questionnaire";
import {LecturerPerformanceChart} from "@/lib/types/kpi";

export async function createLecturer(values: {
  fullName: string
  email: string
  password: string
  department_id:number
  faculty_id:number
}) {

  const {data,status,error} = await makeAuthRequest<{
    full_name: string
    email: string
    password: string
    confirmPassword?: string
  },User>({
    method: "POST",
    headers: {"Content-Type": "application/json"},
    url: `/users/lecturers`,
    data:{full_name:values.fullName,email:values.email,password:values.password,faculty_id:values.faculty_id,department_id:values.department_id}
  })

  if (data && status === 201) {
    return {data,message:error.message,status:status}
  }else{
    return { error:error.message };
  }
}



export async function fetchAllLecturers() {
  const {data,status} = await makeAuthRequest<null, {data:User[]}>({
    method: "GET",
    url: "/users/lecturers"
  });
    if (data && status === 200) {
        return {data:data.data,status:status};
    } else {
        return { error: "Failed to fetch lecturers" };
    }
}

export async function deleteLecturer(id: string) {
  return makeAuthRequest<null, null>({
    method: "DELETE",
    url: `/users/lecturers/${id}`
  });
}

export async function updateLecturer(id: string, data: Partial<User>) {
  return makeAuthRequest<Partial<User>, User>({
    method: "PATCH",
    url: `/users/${id}`,
    data
  });
}

export async function getLecturerQuestionnaires(lecturerId: string) {
  const {data, status, error} = await makeAuthRequest<null, {data: Questionnaire[]}>({
    method: "GET",
    url: `/lecturers/${lecturerId}/questionnaires`
  });

  if (data && status === 200) {
    return {data:data.data,status:status};
  } else {
    return { error: error.message || "Failed to fetch lecturer questionnaires" };
  }
}

export async function getLecturerPerformanceByCriterion(lecturerId: number) {
  const {data, status, error} = await makeAuthRequest<null, LecturerPerformanceChart[]>({
    method: "GET",
    url: `/kpis/lecturers/performance-chart`
  });
  return {data:data??[],status:status===200,error};
}

