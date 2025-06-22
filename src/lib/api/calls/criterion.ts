'use server';
import {makeAuthRequest} from "@/lib/api/session";
import {CreateCriterionPayload, Criterion, UpdateCriterionPayload} from "@/lib/types/criterion";

export async function getCriteria() {
    const {data, status, error} = await makeAuthRequest<null, Criterion[]>({
        method: "GET",
        url: `/criteria`
    });

    return {data:data,status:status===200,error};
}


export async function createCriterion(criterion: CreateCriterionPayload) {
    const {data, status, error} = await makeAuthRequest<CreateCriterionPayload, Criterion>({
        method: "POST",
        url: `/criteria`,
        data:criterion
    });

    return {data:data,status:status===201,error};
}

export async function updateCriterion(criterion:UpdateCriterionPayload,id: number) {
    const {data, status, error} = await makeAuthRequest<UpdateCriterionPayload, Criterion>({
        method: "PUT",
        url: `/criteria/${id}`,
        data:criterion
    });

    return {data:data,status:status===201,error};
}
