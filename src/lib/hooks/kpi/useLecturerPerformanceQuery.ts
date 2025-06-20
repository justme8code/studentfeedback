// In: @/lib/hooks/kpi/useLecturerPerformanceQuery.ts


import { useQuery } from '@tanstack/react-query';
import { fetchLecturerPerformances } from "@/lib/api/calls/kpi/kpi";

export function useLecturerPerformanceQuery() {
    return useQuery({
        queryKey: ['lecturer-performances'],
        queryFn: async () => {
            // The function now returns our serializable ApiResponse object
            const res = await fetchLecturerPerformances();

            // If the status is false, throw an error so React Query can handle it
            if (!res.status) {
                throw new Error(res.error.message || 'Failed to fetch lecturer performances');
            }

            // On success, return the data
            return res.data;
        },
    });
}