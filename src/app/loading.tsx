// app/dashboard/loading.tsx
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    // For this example, we'll just show a centered spinner.
    return (
        <div className="flex h-screen items-center justify-center">
            <LoadingSpinner size="lg" />
        </div>
    );
}