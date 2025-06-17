'use server';
import {makeAuthRequest} from "@/lib/api/session";
import type { User } from "@/lib/types/user";
import {myRequest} from "@/lib/api/axios";


export async function createLecturer(values: {
  fullName: string
  email: string
  password: string
  confirmPassword: string
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
    data:{full_name:values.fullName,email:values.email,password:values.password}
  })

  if (data && status === 201) {
    return {data,message:error.message,status:status}
  }else{
    return { error:error.message };
  }
}



export async function fetchAllLecturers() {
  return makeAuthRequest<null, User[]>({
    method: "GET",
    url: "/users/lecturers"
  });
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

