// In: @/lib/hooks/kpi/useDashboardOverviewQuery.ts


import { useQuery } from '@tanstack/react-query';
import { fetchDashBoardOverview } from "@/lib/api/calls/kpi/kpi";
import {getActiveSession} from "@/lib/api/calls/session";

export function useActiveSession() {
    return useQuery({
        queryKey: ['active-session'],
        queryFn: async () => {
            // The function now returns our serializable ApiResponse object
            const res = await getActiveSession();

            // If the status is false, throw an error so React Query can handle it
            if (!res.status) {
                throw new Error(res.error.message || 'Failed to fetch  current session');
            }

            // On success, return the data
            return res.data;
        },
    });
}