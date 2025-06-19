'use server';
import {makeAuthRequest} from "@/lib/api/session";
import {Questionnaire, QuestionnaireCreatePayload, ResponseQuestionnaire} from "@/lib/types/questionnaire";
import {PaginatedData} from "@/lib/types/paginated";
import {PaginatedFeedbackResponse, Questionnaire2} from "@/lib/schema";
import {Feedback} from "@/lib/types/feedback";
import {FeedbackSubmission} from "@/lib/types/feedback-submission";

export async function createQuestionnaire(questionnaire: QuestionnaireCreatePayload) {

    console.log(questionnaire)
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

export async function getQuestionnaireById(id: number) {
    const {data, status, error} = await makeAuthRequest<null, Questionnaire2>({
        method: "GET",
        url: `/questionnaires/${id}`
    });
    console.log(data);

    return {data: data, status: status==200,error:error.message};
}

export async function updateQuestionnaireStatus(id: number,current:string) {
    const {status, error} = await makeAuthRequest<{status:string}, null>({
        method: "PUT",
        url: `/questionnaires/${id}/status`,
        data:{status:current==="active" ? "inactive" : "active"}
    });
        return {status: status,error: error.message};

}

export async function getPendingQuestionnairesById(id:number) {
    const {data, status, error} = await makeAuthRequest<null,PaginatedData<ResponseQuestionnaire>>({
        method: "GET",
        url: `/students-questionnaires/${id}/pending-questionnaires`,
    });

    if (data && status === 200) {
        return {data, status: status};
    } else {
        return {error: error.message};
    }
}


export async function createFeedbackByQuestionnaireId(id:number,feedback:Feedback[]) {
    const {status, error} = await makeAuthRequest<Feedback[],null>({
        method: "POST",
        url: `/questionnaires/${id}/feedbacks`,
        data: feedback
    });

    return {status:status===201,error:error.message};
}

export async function getFeedbackByQuestionnaireId(id:number,questionId:number) {
    const {data, status, error} = await makeAuthRequest<null,PaginatedData<Feedback>>({
        method: "GET",
        url: `/questionnaires/${id}/questions/${questionId}/feedbacks`
    });

    if (data && status === 200) {
        return {data: data.data, status: status};
    } else {
        return {error: error.message};
    }
}
export async  function feedbackSubmissions(id:number) {
    const {data, status, error} = await makeAuthRequest<null,PaginatedData<FeedbackSubmission>>({
        method: "GET",
        url: `/students-questionnaires/${id}/submissions`
    });

    return {data: data?.data, status: status === 200, error: error.message};

}

export async function getFeedbackForQuestion(questionnairId:number,questionId: number) {
    // Note the return type here
    const { data, status, error } = await makeAuthRequest<null, PaginatedFeedbackResponse>({
        method: "GET",
        // This URL should match your backend route for getting answers for a specific question
        url: `/questionnaires/${questionnairId}/questions/${questionId}/feedbacks`
    });

    return { data, status: status === 200, error: error?.message || "An error occurred" };
}