// hooks/use-toast.ts
import { toast, type ExternalToast } from "sonner";

/**
 * A custom hook to display toasts with consistent styling and options.
 * This centralizes toast logic, making it easy to manage and update.
 */
export function useToast() {
    /**
     * Displays a success toast.
     * @param message The primary message to display.
     * @param options Optional configuration from `sonner`.
     */
    const showSuccessToast = (message: string, options?: ExternalToast) => {
        toast.success(message, {
            duration: 3000, // Default duration for success toasts
            ...options,
        });
    };

    /**
     * Displays an error toast.
     * @param message The primary message to display.
     * @param options Optional configuration from `sonner`.
     */
    const showErrorToast = (message: string, options?: ExternalToast) => {
        toast.error(message, {
            duration: 5000, // Default duration for error toasts
            ...options,
        });
    };

    /**
     * Displays an informational toast.
     * @param message The primary message to display.
     * @param options Optional configuration from `sonner`.
     */
    const showInfoToast = (message: string, options?: ExternalToast) => {
        toast.info(message, {
            duration: 3000,
            ...options,
        });
    };

    return { showSuccessToast, showErrorToast, showInfoToast };
}