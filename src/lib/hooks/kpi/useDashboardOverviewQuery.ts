// In: @/lib/hooks/kpi/useDashboardOverviewQuery.ts


import { useQuery } from '@tanstack/react-query';
import { fetchDashBoardOverview } from "@/lib/api/calls/kpi/kpi";

export function useDashboardOverviewQuery() {
    return useQuery({
        queryKey: ['dashboard-overview'],
        queryFn: async () => {
            // The function now returns our serializable ApiResponse object
            const res = await fetchDashBoardOverview();

            // If the status is false, throw an error so React Query can handle it
            if (!res.status) {
                throw new Error(res.error.message || 'Failed to fetch dashboard data');
            }

            // On success, return the data
            return res.data;
        },
    });
}