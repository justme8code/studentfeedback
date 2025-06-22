'use client';

import React from 'react';
import { LecturerPerformanceChart } from "@/lib/types/kpi";

// Helper functions and props are now fully typed
const getPillColor = (score: number): string => {
    if (score >= 4.0) return '#28a745'; // Green
    if (score >= 3.0) return '#ffc107'; // Yellow
    return '#dc3545'; // Red
};

interface PillProps {
    label: string;
    score: number;
}

const Pill = ({ label, score }: PillProps) => (
    <div className="inline-flex items-center bg-gray-100 rounded-full m-1 shadow-sm overflow-hidden font-sans">
        <span className="px-3 py-2">{label}</span>
        <span
            className="text-white px-3 py-2 font-bold min-w-[50px] text-center"
            style={{ backgroundColor: getPillColor(score) }}
        >
      {/* No more `parseFloat` needed here! */}
            {score.toFixed(2)}
    </span>
    </div>
);

interface PerformancePillsProps {
    performanceData: LecturerPerformanceChart[];
}

const PerformancePills = ({ performanceData }: PerformancePillsProps) => {
    return (
        <div className="flex flex-col items-center gap-4">
            <h2 className="text-xl font-medium text-gray-600">Performance Summary</h2>
            <div className="flex flex-wrap justify-center">
                {performanceData.map((item) => (
                    <Pill
                        key={item.criterion_name}
                        label={item.criterion_name}
                        score={item.average_score}
                    />
                ))}
            </div>
        </div>
    );
};

export default PerformancePills;