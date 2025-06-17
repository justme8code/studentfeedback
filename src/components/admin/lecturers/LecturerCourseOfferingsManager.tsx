'use client';
import React, { useEffect, useState } from "react";
import { getAllCourseOfferingsByLecturerId, createCourseOfferings } from "@/lib/api/calls/course-offerings";
import { getAllCourses } from "@/lib/api/calls/course";
import { getCurrentSession } from "@/lib/api/calls/session";

// Import UI components from your library (e.g., shadcn/ui)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, CheckCircle2, BookOpen } from "lucide-react";
import {CourseOfferingWithDetails} from "@/lib/types/course-offering";
import {Course} from "@/lib/types";
import {Semester} from "@/lib/types/semester";
import {Lecturer} from "@/lib/types/lecturer";

// --- The logic inside the component remains the same ---

export function LecturerCourseOfferingsManager({ lecturer , onClose}: { lecturer: Lecturer , onClose: () => void }) {
    const [offerings, setOfferings] = useState<CourseOfferingWithDetails[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ course_id: "", semester_id: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        setLoading(true);
        Promise.all([
            getAllCourseOfferingsByLecturerId(lecturer.id),
            getAllCourses(),
            getCurrentSession()
        ]).then(([offeringsRes, coursesRes, semestersRes]) => {
            if (offeringsRes.status && offeringsRes.data) setOfferings(offeringsRes.data);
            if (coursesRes.status && coursesRes.data) setCourses(coursesRes.data);
            if (semestersRes.status && semestersRes.data) setSemesters(semestersRes.data.semesters);
            setLoading(false);
        });
    }, [lecturer.id]);

    const handleAssign = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!form.course_id || !form.semester_id) {
            setError("Please select a course and semester");
            return;
        }
        const res = await createCourseOfferings(lecturer.id, form.course_id, form.semester_id);
        if (res.status) {
            setSuccess("Assign Course successful");
            const offeringsRes = await getAllCourseOfferingsByLecturerId(lecturer.id);
            if (offeringsRes.status && offeringsRes.data) setOfferings(offeringsRes.data);
            setForm({ course_id: "", semester_id: "" });
        } else {
            setError(res.error?.message || "Failed to assign course offering");
        }
    };


    // --- The UI is rendered below with improved components ---

    return (
        <div className="w-full">
            <div>
                <CardTitle>Courses Manager</CardTitle>
                <CardDescription>
                    Viewing and assigning courses for {lecturer.full_name}
                </CardDescription>
            </div>
            <div>
                {loading ? (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-muted-foreground">Current Assignments</h3>
                        <div className="space-y-3">
                            <div className="h-12 w-full animate-pulse rounded-md bg-muted" />
                            <div className="h-12 w-full animate-pulse rounded-md bg-muted" />
                        </div>
                    </div>
                ) : (
                    <>
                        <h3 className="text-lg font-semibold mb-3">Current Assignments</h3>
                        <div className="space-y-3 mb-6">
                            {offerings.length > 0 ? (
                                offerings.map((off,index) => (
                                    <div key={index} className="border rounded-lg p-3 flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{off.course.course_title} ({off.course.course_code})</p>
                                            <p className="text-sm text-muted-foreground">Semester: {off.semester.name}</p>
                                        </div>
                                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 px-3 border-2 border-dashed rounded-lg">
                                    <p className="text-muted-foreground">No course offerings have been assigned yet.</p>
                                </div>
                            )}
                        </div>

                        <Separator className="my-6" />

                        <div>
                            <h3 className="text-lg font-semibold mb-3">Assign New Course</h3>
                            <form onSubmit={handleAssign} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="course-select">Course</Label>
                                        <Select
                                            value={form.course_id}
                                            onValueChange={value => setForm(f => ({ ...f, course_id: value }))}
                                            required
                                        >
                                            <SelectTrigger id="course-select">
                                                <SelectValue placeholder="Select a course..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {courses.map((c: Course) => (
                                                    <SelectItem key={c.id} value={String(c.id)}>
                                                        {c.course_title} ({c.course_code})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="semester-select">Semester (Current Session)</Label>
                                        <Select
                                            value={form.semester_id}
                                            onValueChange={value => setForm(f => ({ ...f, semester_id: value }))}
                                            required
                                        >
                                            <SelectTrigger id="semester-select">
                                                <SelectValue placeholder="Select a semester..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {semesters.map((s: Semester) => (
                                                    <SelectItem key={s.id} value={String(s.id)}>
                                                        {s.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>


                                <div className="flex gap-5 justify-end items-center">
                                    {/*  THIS IS THE FIX  */}
                                    <Button type="button" variant="outline" onClick={onClose}>
                                        close
                                    </Button>

                                    <Button type="submit">Assign Course</Button>
                                </div>
                            </form>
                        </div>

                        {error && (
                            <Alert variant="destructive" className="mt-4">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Assignment Failed</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        {success && (
                            <Alert variant="default" className="mt-4 border-green-500 text-green-700 dark:border-green-600 dark:text-green-400">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <AlertTitle>Success</AlertTitle>
                                <AlertDescription>{success}</AlertDescription>
                            </Alert>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}