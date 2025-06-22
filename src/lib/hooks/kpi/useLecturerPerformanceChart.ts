import { useQuery } from "@tanstack/react-query";
import { getLecturerPerformanceByCriterion } from "@/lib/api/calls/lecturer";
import { LecturerPerformanceChart, LecturerPerformanceChartAPI } from "@/lib/types/kpi";

// This hook now fetches the raw data and processes it into the clean format.
export function useLecturerPerformanceChart(lecturerId: number | undefined) {
    return useQuery<LecturerPerformanceChart[], Error>({ // Explicitly type the expected return data and error
        queryKey: ['lecturer-performance-chart', lecturerId],
        queryFn: async () => {
            // The non-null assertion `!` is safe here because of the `enabled` option below.
            const res = await getLecturerPerformanceByCriterion(lecturerId!);

            if (!res.status) {
                throw new Error(res.error?.message || 'Failed to fetch lecturer performance data');
            }

            // --- Data Transformation Step ---
            // Convert the raw API data into the clean format our components need.
            // This is the ONLY place we need to do `parseFloat`.
            const rawData: LecturerPerformanceChartAPI[] = res.data;
            return rawData.map(item => ({
                ...item,
                average_score: parseFloat(item.average_score),
            }));
        },
        // This is crucial: the query will not run until `lecturerId` has a value.
        enabled: !!lecturerId,
    });
}