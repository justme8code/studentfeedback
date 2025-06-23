import { useQuery } from "@tanstack/react-query";
import { getLecturerPerformanceByCriterion } from "@/lib/api/calls/lecturer";
import { LecturerPerformanceChart} from "@/lib/types/kpi";

export function useLecturerPerformanceChart(lecturerId: number|undefined) {
    return useQuery<LecturerPerformanceChart[], Error>({
        queryKey: ['lecturer-performance-chart', lecturerId],
        queryFn: async () => {
            if (!lecturerId) {
                // This case is handled by `enabled`, but it's good practice for type safety.
                return [];
            }
            const res = await getLecturerPerformanceByCriterion(lecturerId);

            if (!res.status) {
                throw new Error(res.error?.message || 'Failed to fetch lecturer performance data');
            }
            return res.data;
        },
        // The query will not run until `lecturerId` is a truthy value.
        enabled: !!lecturerId,
    });
}