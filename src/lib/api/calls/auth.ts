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
    fullName: string
    email: string
    password: string
    confirmPassword: string
}) {

    const {data,status,error} = await myRequest<{
        full_name: string
        email: string
        password: string
        role_id:number;
        confirmPassword?: string
    },AuthResponse>({
        method: "POST",
        headers: {"Content-Type": "application/json"},
        url: `/auth/register`,
        data:{full_name:values.fullName,email:values.email,password:values.password,role_id:2}
    })

    const res = data;
    if (res && res.success && res.data && res.data.token && status === 200) {
        await createSession(res.data.token);

        return {user:res.data.user,new_user:true,message:data.message,status:status}
    }else{
        return { error:error.message };
    }
}


export async function logout() {
    await deleteSession();
    redirect("/auth");
}