'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartOptions, ChartData } from 'chart.js';
import { LecturerPerformanceChart } from "@/lib/types/kpi";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Helper function is now fully typed
const getBarColor = (score: number): string => {
    if (score >= 4.0) return 'rgba(40, 167, 69, 0.6)'; // Green
    if (score >= 3.0) return 'rgba(255, 193, 7, 0.6)'; // Yellow
    return 'rgba(220, 53, 69, 0.6)'; // Red
};

const getBorderColor = (score: number): string => {
    if (score >= 4.0) return 'rgba(40, 167, 69, 1)';
    if (score >= 3.0) return 'rgba(255, 193, 7, 1)';
    return 'rgba(220, 53, 69, 1)';
};

interface PerformanceChartProps {
    performanceData: LecturerPerformanceChart[];
}

const PerformanceChart = ({ performanceData }: PerformanceChartProps) => {
    // No more `parseFloat` needed here! Scores are already numbers.
    const labels = performanceData.map(item => item.criterion_name);
    const scores = performanceData.map(item => item.average_score);

    const chartData: ChartData<'bar'> = {
        labels: labels,
        datasets: [{
            label: 'Average Performance Score (out of 5)',
            data: scores,
            backgroundColor: scores.map(score => getBarColor(score)),
            borderColor: scores.map(score => getBorderColor(score)),
            borderWidth: 1,
        }],
    };

    const options: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Overall Performance by Criterion',
                font: { size: 18 },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 5,
                title: { display: true, text: 'Average Score' },
            },
        },
    };

    return (
        <div style={{ height: '400px', width: '100%' }}>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default PerformanceChart;