// components/ui/loading-spinner.tsx
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const spinnerVariants = cva(
    "text-muted-foreground animate-spin",
    {
        variants: {
            size: {
                default: "h-4 w-4",
                sm: "h-2 w-2",
                lg: "h-6 w-6",
                icon: "h-10 w-10"
            }
        },
        defaultVariants: {
            size: "default",
        },
    },
);

// We need this interface and the variants to be accessible to other components
type SpinnerProps = VariantProps<typeof spinnerVariants>

const LoadingSpinner = ({
                            size,
                        }: SpinnerProps) => {
    return (
        <Loader2 className={cn(spinnerVariants({ size }))} />
    );
};

export { LoadingSpinner, spinnerVariants };
export type { SpinnerProps }; // Also good practice to export the type