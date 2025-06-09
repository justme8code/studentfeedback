"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";


import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Star, MessageCircle, Zap, BookOpen, ThumbsUp, ThumbsDown, FileText as FileTextIcon } from "lucide-react"; // Renamed FileText to avoid conflict
import { useRouter, useSearchParams } from "next/navigation"; // Added useSearchParams
import { useEffect } from "react";
import {FeedbackFormData, feedbackFormSchema} from "@/lib/schema";

// --- Fallback Mock Course Data ---
const mockCourseDefault = {
    id: "crs_default", // A generic ID
    name: "Selected Course", // A generic name
    code: "CODE_DEFAULT", // A generic code
};
// --- End Fallback Mock Data ---


// Helper for rating labels
const ratingLabels: { [key: number]: string } = {
    1: "Very Poor",
    2: "Poor",
    3: "Average",
    4: "Good",
    5: "Excellent",
};

export default function SubmitFeedbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams(); // Get search params

    // Get course details from query params or use fallback
    const queryCourseId = searchParams.get('courseId');
    const queryCourseName = searchParams.get('courseName');

    // Determine the initial course data for the form
    const initialCourse = {
        id: queryCourseId || mockCourseDefault.id,
        name: queryCourseName || mockCourseDefault.name,
    };

    // 1. Define your form.
    const form = useForm<FeedbackFormData>({
        resolver: zodResolver(feedbackFormSchema),
        defaultValues: {
            courseId: initialCourse.id,
            courseName: initialCourse.name,
            overallRating: undefined,
            instructorClarity: undefined,
            courseRelevance: undefined,
            workload: undefined,
            likedMost: "",
            suggestionsForImprovement: "",
            comments: "",
        },
    });

    // Effect to update form values if query parameters are present and change
    // This ensures the form is correctly initialized if navigated to with query params
    useEffect(() => {
        const qId = searchParams.get('courseId');
        const qName = searchParams.get('courseName');

        // Only reset if query params are actually different from current form values
        // or if they exist and the form hasn't been initialized with them yet.
        if (qId && form.getValues("courseId") !== qId) {
            form.setValue("courseId", qId);
        }
        if (qName && form.getValues("courseName") !== qName) {
            form.setValue("courseName", qName);
        }
        // If no query params, and current form values are the default mock, no need to reset
        // This logic can be refined based on how you want the form to behave if query params are removed mid-session
    }, [searchParams, form]);


    // 2. Define a submit handler.
    function onSubmit(values: FeedbackFormData) {
        console.log("Feedback submitted:", values);
        alert(
            `Feedback for ${values.courseName} submitted successfully!\nOverall Rating: ${values.overallRating}`
        );
        // Reset form to its initial state (considering the course it was for)
        // or to a blank state if preferred.
        form.reset({
            courseId: initialCourse.id, // Reset with the courseId it was submitted for
            courseName: initialCourse.name, // Reset with the courseName
            overallRating: undefined,
            instructorClarity: undefined,
            courseRelevance: undefined,
            workload: undefined,
            likedMost: "",
            suggestionsForImprovement: "",
            comments: "",
        });
        // Optionally navigate away, e.g., to dashboard or "My Feedback" page
        // router.push("/dashboard");
    }

    // Watch form values for dynamic display
    const overallRatingValue = form.watch("overallRating");
    const instructorClarityValue = form.watch("instructorClarity");
    const courseRelevanceValue = form.watch("courseRelevance");
    const workloadValue = form.watch("workload");
    const currentCourseName = form.watch("courseName"); // Watch courseName for the title


    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-3xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        {/* Display current course name from form state, fallback to initial if not yet set */}
                        Submit Feedback for: {currentCourseName || initialCourse.name}
                    </CardTitle>
                    <CardDescription>
                        Your anonymous feedback helps improve our courses. Please be honest and constructive.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {/* Hidden field for courseId - not directly user-editable but part of form data */}
                            <FormField
                                control={form.control}
                                name="courseId"
                                render={({ field }) => (
                                    <FormItem className="hidden">
                                        <FormControl>
                                            <Input type="hidden" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            {/* Hidden field for courseName - not directly user-editable but part of form data for consistency */}
                            <FormField
                                control={form.control}
                                name="courseName"
                                render={({ field }) => (
                                    <FormItem className="hidden">
                                        <FormControl>
                                            <Input type="hidden" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Overall Rating - Using RadioGroup for clear selection */}
                            <FormField
                                control={form.control}
                                name="overallRating"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel className="text-lg font-semibold flex items-center">
                                            <Star className="mr-2 h-5 w-5 text-yellow-500" /> Overall Course Rating
                                        </FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={(value) => field.onChange(parseInt(value))}
                                                // defaultValue={field.value?.toString()} // defaultValue on RadioGroup can be tricky with react-hook-form
                                                value={field.value?.toString()} // Control with value prop
                                                className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0"
                                            >
                                                {[1, 2, 3, 4, 5].map((rating) => (
                                                    <FormItem key={rating} className="flex items-center space-x-2 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value={rating.toString()} />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            {rating} ({ratingLabels[rating]})
                                                        </FormLabel>
                                                    </FormItem>
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                        {overallRatingValue !== undefined && overallRatingValue > 0 && (
                                            <FormDescription>
                                                You selected: {overallRatingValue} ({ratingLabels[overallRatingValue]})
                                            </FormDescription>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Specific Criteria Ratings - Using Slider */}
                            <div className="space-y-6 p-4 border rounded-md">
                                <h3 className="text-md font-semibold mb-1">Specific Aspects:</h3>
                                <FormField
                                    control={form.control}
                                    name="instructorClarity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center">
                                                <MessageCircle className="mr-2 h-5 w-5 text-blue-500" /> Instructor's Clarity
                                                {instructorClarityValue !== undefined && instructorClarityValue > 0 && <span className="ml-2 text-sm text-muted-foreground">({ratingLabels[instructorClarityValue]})</span>}
                                            </FormLabel>
                                            <FormControl>
                                                <Slider
                                                    value={[field.value || 3]} // Control with value prop
                                                    min={1}
                                                    max={5}
                                                    step={1}
                                                    onValueChange={(value) => field.onChange(value[0])}
                                                    className="py-2"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="courseRelevance"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center">
                                                <BookOpen className="mr-2 h-5 w-5 text-green-500" /> Course Material Relevance
                                                {courseRelevanceValue !== undefined && courseRelevanceValue > 0 && <span className="ml-2 text-sm text-muted-foreground">({ratingLabels[courseRelevanceValue]})</span>}
                                            </FormLabel>
                                            <FormControl>
                                                <Slider
                                                    value={[field.value || 3]} // Control with value prop
                                                    min={1}
                                                    max={5}
                                                    step={1}
                                                    onValueChange={(value) => field.onChange(value[0])}
                                                    className="py-2"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="workload"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center">
                                                <Zap className="mr-2 h-5 w-5 text-red-500" /> Course Workload
                                                {workloadValue !== undefined && workloadValue > 0 && <span className="ml-2 text-sm text-muted-foreground">({ratingLabels[workloadValue]})</span>}
                                            </FormLabel>
                                            <FormControl>
                                                <Slider
                                                    value={[field.value || 3]} // Control with value prop
                                                    min={1}
                                                    max={5}
                                                    step={1}
                                                    onValueChange={(value) => field.onChange(value[0])}
                                                    className="py-2"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Open-ended Questions */}
                            <FormField
                                control={form.control}
                                name="likedMost"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-lg font-semibold flex items-center">
                                            <ThumbsUp className="mr-2 h-5 w-5 text-sky-500" /> What did you like most about this course? (Optional)
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="e.g., The hands-on projects, the instructor's enthusiasm..."
                                                className="min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Share specific aspects you found particularly valuable or enjoyable.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="suggestionsForImprovement"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-lg font-semibold flex items-center">
                                            <ThumbsDown className="mr-2 h-5 w-5 text-orange-500" /> What could be improved? (Optional)
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="e.g., More examples in lectures, clearer assignment instructions..."
                                                className="min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Constructive suggestions are highly appreciated.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="comments"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-lg font-semibold flex items-center">
                                            <FileTextIcon className="mr-2 h-5 w-5 text-gray-500" /> Additional Comments (Optional)
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Any other thoughts or feedback you'd like to share..."
                                                className="min-h-[120px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <CardFooter className="p-0 pt-6">
                                <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting ? "Submitting..." : "Submit Feedback"}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => router.back()} className="ml-auto hidden sm:inline-flex">
                                    Cancel
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}