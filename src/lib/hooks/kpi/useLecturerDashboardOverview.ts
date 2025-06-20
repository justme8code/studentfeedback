
import {fetchLecturerOverView} from "@/lib/api/calls/kpi/kpi";
import {useQuery} from "@tanstack/react-query";

export function useLecturerDashboardOverviewQuery(id: string) {
    return useQuery({
        queryKey: ['lecturer-dashboard-overview', id], // important for caching per id
        queryFn: async () => {
            const res = await fetchLecturerOverView(id);

            if (!res.status) {
                throw new Error(res.error.message || 'Failed to fetch dashboard data');
            }

            return res.data;
        },
        enabled: !!id
    });
}
