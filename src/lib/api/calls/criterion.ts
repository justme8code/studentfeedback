'use server';
import {makeAuthRequest} from "@/lib/api/session";
import {Criterion} from "@/lib/types/criterion";

export async function getCriteria() {
    const {data, status, error} = await makeAuthRequest<null, Criterion[]>({
        method: "GET",
        url: `/criteria`
    });

    if (data && status === 200) {
        return {data:data,status:status};
    } else {
        return { error: error.message || "Failed to fetch lecturer questionnaires" };
    }
}