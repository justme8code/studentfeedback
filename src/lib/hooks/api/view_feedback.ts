import {useQuery} from "@tanstack/react-query";
import {getCriteria} from "@/lib/api/calls/criterion";
import {getFeedbackResponse} from "@/lib/api/calls/questionnaire";


export function useFeedbackList(id: string) {
    return useQuery({
        queryKey: ['feedback-list',id],
        queryFn: async () => {
            const res = await getFeedbackResponse(id);
            if (!res.status) throw new Error(res.error.message || 'Failed to fetch criteria');
            return res.data;
        },
        enabled: !!id,
    });
}