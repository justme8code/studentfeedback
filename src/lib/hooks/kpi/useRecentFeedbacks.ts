// In: @/lib/hooks/kpi/useLecturerPerformanceQuery.ts


import { useQuery } from '@tanstack/react-query';
import {fetchLecturerPerformances, fetchRecentFeedbacks} from "@/lib/api/calls/kpi/kpi";

export function  useRecentFeedbacks(id:string) {
    return useQuery({
        queryKey: ['lecturer-performances'],
        queryFn: async () => {
            // The function now returns our serializable ApiResponse object
            const res = await fetchRecentFeedbacks(id);

            // If the status is false, throw an error so React Query can handle it
            if (!res.status) {
                throw new Error(res.error.message || 'Failed to fetch recent feedbacks');
            }

            // On success, return the data
            return res.data;
        },
    });
}