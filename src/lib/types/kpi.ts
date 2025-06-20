export interface DashboarOverview {
    totalLecturers: number;
    totalStudents: number;
    responseRate: number;
}

export interface LecturerPerformance {
    lecturerName: string;
    department: string;
    numberOfCourses: number;
    numberOfReviews: number;
    averageRating: number; // 0 to 5 scale
}

export interface LecturerDashboardOverview {
    activeCoursesCount: number,
    activeStudents: number,
    activeSemesterResponseRate: number,
    averageRating: number,
    totalStudentsTaught: number,
    lecturerName: string
}

export interface LecturerCoursePerformance {
    courseName: string;
    courseCode: string;
    semesterName: string;
    departmentName: string;
    rating: string;
    numberOfReviews: number;
}