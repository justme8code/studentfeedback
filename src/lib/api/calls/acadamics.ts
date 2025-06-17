// lib/api/calls/academics.ts
import type { Course, Department, Faculty } from "@/lib/types";

// --- MOCK DATABASE ---
const faculties: Faculty[] = [
    { id: "f-1", name: "Faculty of Science" },
    { id: "f-2", name: "Faculty of Arts" },
    { id: "f-3", name: "Faculty of Engineering" },
];

const departments: Department[] = [
    { id: "d-1", name: "Computer Science", facultyId: "f-1" },
    { id: "d-2", name: "Physics", facultyId: "f-1" },
    { id: "d-3", name: "History", facultyId: "f-2" },
    { id: "d-4", name: "English Literature", facultyId: "f-2" },
    { id: "d-5", name: "Mechanical Engineering", facultyId: "f-3" },
    { id: "d-6", name: "Electrical Engineering", facultyId: "f-3" },
];

const courses: Course[] = [
    { id: "c-1", name: "Introduction to Programming", code: "CS101", departmentId: "d-1" },
    { id: "c-2", name: "Data Structures", code: "CS201", departmentId: "d-1" },
    { id: "c-3", name: "Classical Mechanics", code: "PHY101", departmentId: "d-2" },
    { id: "c-4", name: "World War II", code: "HIS202", departmentId: "d-3" },
    { id: "c-5", name: "Shakespeare", code: "ENG301", departmentId: "d-4" },
    { id: "c-6", name: "Thermodynamics", code: "ME201", departmentId: "d-5" },
    { id: "c-7", name: "Circuit Theory", code: "EE201", departmentId: "d-6" },
];
// --- END MOCK DATABASE ---


// Simulate a network request
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getFaculties = async (): Promise<Faculty[]> => {
    await delay(500); // Simulate network latency
    return faculties;
};

export const getDepartmentsByFaculty = async (facultyId: string): Promise<Department[]> => {
    await delay(700);
    return departments.filter(d => d.facultyId === facultyId);
};

export const getCoursesByDepartment = async (departmentId: string): Promise<Course[]> => {
    await delay(400);
    return courses.filter(c => c.departmentId === departmentId);
}

// This is the function you'll call to save the user's choice
export const saveUserAcademicInfo = async (data: { facultyId: string; departmentId: string }) => {
    await delay(1000);
    console.log("Saving to DB:", data);
    // In a real app, this would be a POST/PUT request to your backend.
    // The backend would associate the user with this faculty and department.
    return { success: true, message: "Your information has been saved!" };
}