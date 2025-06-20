// components/ui/full-page-loader.tsx
import { LoadingSpinner, type SpinnerProps } from "./loading-spinner";

interface FullPageLoaderProps {
    /**
     * The message to display below the spinner.
     */
    message?: string;
    /**
     * The size of the spinner. Defaults to "lg".
     */
    size?: SpinnerProps["size"];
}

/**
 * A full-page loader component that overlays the entire screen.
 * It is not visible by default and must be controlled by state.
 */
export function FullPageLoader({ message, size = "lg" }: FullPageLoaderProps) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
            <LoadingSpinner size={size} />
            {message && (
                <p className="mt-4 text-center text-lg text-muted-foreground">
                    {message}
                </p>
            )}
        </div>
    );
}