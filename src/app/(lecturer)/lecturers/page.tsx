"use client";

import { useState, useEffect } from "react"; // NEW: Import hooks for state and effects
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Book } from "lucide-react";
import { useUserStore } from "@/lib/hooks/useUserStore";
import { getAllCourseOfferingsByLecturerId } from "@/lib/api/calls/course-offerings";
import {CourseOfferingWithDetails} from "@/lib/types/course-offering";
import {CourseOfferingSkeleton} from "@/components/lecturer/CourseOfferingSkeleton";
import {CourseOfferingCard} from "@/components/lecturer/course-offering-card";
import {Criterion} from "@/lib/types/criterion";
import {getCriteria} from "@/lib/api/calls/criterion";

export default function DashboardPage() {
    // 1. Get user from the client-side store
    const { user } = useUserStore();

    // 2. Set up state for data fetching
    const [offerings, setOfferings] = useState<CourseOfferingWithDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true); // Start in loading state
    const [error, setError] = useState<string | null>(null);


    // 3. Fetch data inside a useEffect hook
    useEffect(() => {
        // Only fetch if we have a user
        if (!user) {
            setIsLoading(false);
            return;
        }

        async function fetchOfferings() {
            try {
                setIsLoading(true);
                setError(null);
                if (user !=null && user.id !=undefined) {
                    const result = await getAllCourseOfferingsByLecturerId(user.id.toString());
                    console.log(result.data);
                    if (result.data) {
                        setOfferings(result.data);
                    }
                }


            } catch (err) {
                const message = err instanceof Error ? err.message : "An unknown error occurred.";
                setError(message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchOfferings();
    }, [user]); // The effect re-runs if the user object changes

    // This is a "guard clause" for when the store is initializing
    if (!user) {
        return (
            <div className="container mx-auto p-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Authentication Error</AlertTitle>
                    <AlertDescription>Could not find user. Please log in again.</AlertDescription>
                </Alert>
            </div>
        );
    }

    // This function helps render the main content based on the current state
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Render 3 skeleton cards as placeholders */}
                    <CourseOfferingSkeleton />
                    <CourseOfferingSkeleton />
                    <CourseOfferingSkeleton />
                </div>
            );
        }

        if (error) {
            return (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Could Not Load Courses</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            );
        }

        if (offerings.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg">
                    <Book className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">No Courses Assigned</h3>
                    <p className="text-muted-foreground">You do not have any courses assigned to you for this semester yet.</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {offerings.map(offering => (
                    <CourseOfferingCard key={offering.id} offering={offering} />
                ))}
            </div>
        );
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">
                    Welcome back, {user.full_name}!
                </h1>
                <p className="text-muted-foreground">
                    Here are your assigned courses for the current academic session.
                </p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4">Assigned Courses</h2>
                {renderContent()}
            </div>
        </div>
    );
}