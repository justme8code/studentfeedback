'use client';

import React from 'react';
import PerformanceChart from "@/components/charts/PerformanceChart";
import PerformancePills from "@/components/charts/PerformancePills";
import { useUserStore } from "@/lib/hooks/useUserStore";
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import {useLecturerPerformanceChart} from "@/lib/hooks/kpi/useLecturerPerformanceChart";

// A simple skeleton loader for a better UX
const PerformanceSkeleton = () => (
    <div className="flex flex-col w-full md:flex-row justify-between gap-10 items-center">
        <div className="w-full md:w-2/3 space-y-2">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-[400px] w-full" />
        </div>
        <div className="w-full md:w-1/3 space-y-3">
            <Skeleton className="h-8 w-2/3 mx-auto" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    </div>
);

const LecturerPerformanceInfo = () => {
    const { user } = useUserStore();
    const { data, isLoading, isError, error } = useLecturerPerformanceChart(user?.id);

    if (isLoading) {
        return <PerformanceSkeleton />;
    }

    if (isError) {
        return (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Could Not Load Performance Data</AlertTitle>
                <AlertDescription>
                    {error?.message || "An unexpected error occurred. Please try again later."}
                </AlertDescription>
            </Alert>
        );
    }

    if (!data || data.length === 0) {
        return <p>No performance data is available to display.</p>;
    }

    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-col md:flex-row justify-between gap-10 items-start">
                <div className="w-full md:w-2/3">
                    <PerformanceChart performanceData={data} />
                </div>
                <div className="w-full md:w-1/3">
                    <PerformancePills performanceData={data} />
                </div>
            </div>
        </div>
    );
};

export default LecturerPerformanceInfo;