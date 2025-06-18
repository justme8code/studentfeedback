'use server';
import { makeAuthRequest } from "@/lib/api/session";
import { Session } from "@/lib/types/session";

export async function createSession(session: Partial<Session>) {
    const { data, status, error } = await makeAuthRequest<Partial<Session>, Session>({
        method: "POST",
        url: "/sessions",
        data: session
    });
    return { data, status: status === 201, error };
}

export async function getCurrentSession() {
    const { data, status, error } = await makeAuthRequest<null,Session>({
        method: "GET",
        url: "/sessions/current"
    });
    return { data, status: status === 200, error };
}

export async function getSessionsByDate(from: string, to: string) {
    const { data, status, error } = await makeAuthRequest<null,Session[]>({
        method: "GET",
        url: `/sessions/by-date?from=${from}&to=${to}`
    });
    return { data, status: status === 200, error };
}


