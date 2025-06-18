'use server';
import {makeAuthRequest} from "@/lib/api/session";
import {Questionnaire, QuestionnaireCreatePayload} from "@/lib/types/questionnaire";

export async function createQuestionnaire(questionnaire: QuestionnaireCreatePayload) {
    // The makeAuthRequest generic now correctly reflects what you send vs. what you expect back
    const { data, status, error } = await makeAuthRequest<QuestionnaireCreatePayload, Questionnaire>({
        method: "POST",
        url: `/questionnaires`,
        data: questionnaire
    });

    if (data && (status === 201 || status === 200)) {
        return { data, status };
    } else {
        return { error: error.message || "An unknown error occurred." };
    }
}


export async function updateQuestionnaire(id: string, data: Partial<Questionnaire>) {
    const {data: responseData, status, error} = await makeAuthRequest<Partial<Questionnaire>, Questionnaire>({
        method: "PATCH",
        url: `/questionnaires/${id}`,
        data
    });

    if (responseData && status === 200) {
        return {data: responseData, message: error.message, status: status};
    } else {
        return {error: error.message};
    }
}

export async function getQuestionnaire(id: string) {
    const {data, status, error} = await makeAuthRequest<null, Questionnaire>({
        method: "GET",
        url: `/questionnaires/${id}`
    });

    if (data && status === 200) {
        return {data, status: status};
    } else {
        return {error: error.message};
    }
}