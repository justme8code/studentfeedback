
import {fetchLecturerCoursesPerformanceBySession, fetchLecturerOverView} from "@/lib/api/calls/kpi/kpi";
import {useQuery} from "@tanstack/react-query";

export function useLecturerCoursePerformance(id: string,sessionId: number) {
    return useQuery({
        queryKey: ['lecturer-course-performance', id,sessionId], // important for caching per id
        queryFn: async () => {
            const res = await fetchLecturerCoursesPerformanceBySession(id,sessionId);

            if (!res.status) {
                throw new Error(res.error.message || 'Failed to fetch course performance');
            }
            return res.data;
        },
        enabled: !!id
    });
}
