import {useQuery} from "@tanstack/react-query";
import {fetchRecentTextFeedbacks} from "@/lib/api/calls/kpi/kpi";

export function  useRecentTextFeedbacks(id:string) {
    return useQuery({
        queryKey: ['recent-text-feedbacks'],
        queryFn: async () => {
            // The function now returns our serializable ApiResponse object
            const res = await  fetchRecentTextFeedbacks(id);

            // If the status is false, throw an error so React Query can handle it
            if (!res.status) {
                throw new Error(res.error.message || 'Failed to fetch recent feedbacks');
            }

            // On success, return the data
            return res.data;
        },
    });
}