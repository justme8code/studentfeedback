'use client';

import { useParams } from 'next/navigation';
import { useFeedbackList } from '@/lib/hooks/api/view_feedback';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import {FeedbackDetail} from "@/app/(lecturer)/lecturers/questionnaires/view/[id]/FeedbackDetail";

// A simple Skeleton component to show while data is loading
const FeedbackDetailSkeleton = () => (
    <div className="space-y-6">
        <div className="space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
        </div>
        <div className="space-y-4">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-full" />
        </div>
        <div className="space-y-4 pt-4 border-t">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    </div>
);

// It's a good practice to name page components descriptively.
// The file should be named `page.tsx`.
export default function ViewFeedbackPage() {
    // 1. Get route parameters using the useParams hook
    const params = useParams();
    const id = params.id as string; // `params.id` corresponds to the [id] in the folder name

    // 2. Pass the retrieved ID to your data fetching hook
    // We disable the query if `id` is not available yet.
    const { data, isLoading, isError } = useFeedbackList(id);

    // 3. Handle loading state
    if (isLoading || !id) {
        return (
            <div className="container mx-auto p-4 py-8 sm:p-6 lg:p-12 max-w-5xl">
                <FeedbackDetailSkeleton />
            </div>
        );
    }

    // 4. Handle error state
    if (isError) {
        return (
            <div className="container mx-auto p-4 py-8 sm:p-6 lg:p-12 max-w-5xl">
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Failed to load the feedback details. Please try again later.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    // 5. Render the component with the fetched data
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container mx-auto p-4 py-8 sm:p-6 lg:p-12 max-w-5xl">
                {data ? <FeedbackDetail data={data} /> : <p>No feedback data found.</p>}
            </div>
        </div>
    );
}