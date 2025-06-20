'use server';
import {myRequest} from "@/lib/api/axios";
import {createSession, deleteSession} from "@/lib/api/session";
import {redirect} from "next/navigation";
import {User} from "@/lib/types/user";

interface AuthResponse {
    success:boolean,
    message:string,
    data?:{
        user:User,
        token?:string,
    }
}

export async function login(values: {
                                  email: string
                                  password: string
                              }) {

    const {data,status,error} = await myRequest<{
        email: string
        password: string
    },AuthResponse>({
        method: "POST",
        headers: {"Content-Type": "application/json"},
        url: `/auth/login`,
        data:{...values}
    })

    const res = data;

    if(res && res.data && res.data.token && status === 200) {
        await createSession(res.data.token);
    }
    return {user:res?.data?.user,status:status===200,error}
}


export async function signUp(values: {
    full_name: string
    email: string
    password: string
    level: number
    matric_number: string
    department_id: number
    faculty_id: number
}) {

    console.log(values);
    const {data,status,error} = await myRequest< {
        full_name: string
        email: string
        password: string
        level: number
        matric_number: string
        department_id: number
        faculty_id: number
    },{error:string}>({
        method: "POST",
        headers: {"Content-Type": "application/json"},
        url: `/auth/students`,
        data:values
    })

    if(status === 201) {
        return {status:status === 201,error:error.message}
    }
    else {
        return {status:status === 201,error:data.error}
    }


}


export async function logout() {
    await deleteSession();
    redirect("/auth");
}