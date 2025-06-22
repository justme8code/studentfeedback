// components/ui/star-rating.tsx
import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

type StarRatingProps = {
    rating: number;
    maxRating?: number;
    size?: number;
    className?: string;
    showValue?: boolean;
};

export const StarRating = ({
                               rating,
                               maxRating = 5,
                               size = 4, // Corresponds to w-4, h-4
                               className,
                               showValue = false,
                           }: StarRatingProps) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

    const starSize = `w-${size} h-${size}`;

    return (
        <div className={cn("flex items-center space-x-1", className)}>
            {Array.from({ length: fullStars }).map((_, i) => (
                <Star key={`full-${i}`} className={cn(starSize, "text-yellow-400")} fill="currentColor" />
            ))}
            {hasHalfStar && <StarHalf key="half" className={cn(starSize, "text-yellow-400")} fill="currentColor" />}
            {Array.from({ length: emptyStars }).map((_, i) => (
                <Star key={`empty-${i}`} className={cn(starSize, "text-muted-foreground/50")} fill="currentColor" />
            ))}
            {showValue && <span className="text-xs text-muted-foreground ml-2">({rating.toFixed(2)})</span>}
        </div>
    );
};