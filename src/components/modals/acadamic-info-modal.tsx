// components/modals/academic-info-modal.tsx
"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/loading-spinner";

import type { Faculty, Department, Course } from "@/lib/types";
import {getCoursesByDepartment, getDepartmentsByFaculty, getFaculties} from "@/lib/api/calls/acadamics";

interface AcademicInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { facultyId: string; departmentId: string }) => Promise<void>;
}

export function AcademicInfoModal({ isOpen, onClose, onSave }: AcademicInfoModalProps) {
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);

    const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState({
        faculties: true,
        departments: false,
        courses: false,
        saving: false,
    });

    // Fetch all faculties on component mount
    useEffect(() => {
        getFaculties().then(data => {
            setFaculties(data);
            setIsLoading(p => ({ ...p, faculties: false }));
        });
    }, []);

    // Fetch departments when a faculty is selected
    useEffect(() => {
        if (!selectedFaculty) return;
        setDepartments([]); // Clear previous departments
        setCourses([]); // Also clear student-courses
        setSelectedDepartment(null); // Reset department selection
        setIsLoading(p => ({ ...p, departments: true }));
        getDepartmentsByFaculty(selectedFaculty).then(data => {
            setDepartments(data);
            setIsLoading(p => ({ ...p, departments: false }));
        });
    }, [selectedFaculty]);

    // Fetch student-courses when a department is selected
    useEffect(() => {
        if (!selectedDepartment) return;
        setCourses([]); // Clear previous student-courses
        setIsLoading(p => ({ ...p, courses: true }));
        getCoursesByDepartment(selectedDepartment).then(data => {
            setCourses(data);
            setIsLoading(p => ({ ...p, courses: false }));
        });
    }, [selectedDepartment]);

    const handleSave = async () => {
        if (!selectedFaculty || !selectedDepartment) return;
        setIsLoading(p => ({ ...p, saving: true }));
        await onSave({ facultyId: selectedFaculty, departmentId: selectedDepartment });
        setIsLoading(p => ({ ...p, saving: false }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Complete Your Profile</DialogTitle>
                    <DialogDescription>
                        Please select your faculty and department to continue.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* Faculty Selector */}
                    <div className="flex items-center gap-4">
                        {isLoading.faculties ? <LoadingSpinner /> : (
                            <Select onValueChange={setSelectedFaculty}>
                                <SelectTrigger><SelectValue placeholder="Select a Faculty" /></SelectTrigger>
                                <SelectContent>
                                    {faculties.map(faculty => (
                                        <SelectItem key={faculty.id} value={faculty.id}>{faculty.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    {/* Department Selector */}
                    {selectedFaculty && (
                        <div className="flex items-center gap-4">
                            {isLoading.departments ? <LoadingSpinner /> : (
                                <Select onValueChange={setSelectedDepartment} value={selectedDepartment ?? undefined}>
                                    <SelectTrigger><SelectValue placeholder="Select a Department" /></SelectTrigger>
                                    <SelectContent>
                                        {departments.map(dept => (
                                            <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    )}

                    {/* Courses Display */}
                    {selectedDepartment && (
                        <div>
                            <h4 className="font-medium mb-2">Courses in this Department:</h4>
                            {isLoading.courses ? <LoadingSpinner /> : (
                                <ul className="list-disc list-inside text-sm text-muted-foreground">
                                    {courses.length > 0 ? courses.map(course => (
                                        <li key={course.id}>{course.code} - {course.name}</li>
                                    )) : <li>No courses found.</li>}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={handleSave} disabled={!selectedDepartment || isLoading.saving}>
                        {isLoading.saving && <LoadingSpinner size={"lg"} />}
                        Save and Continue
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}