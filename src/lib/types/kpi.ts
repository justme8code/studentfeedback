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

export interface RecentFeedback {
    courseName: string;
    submittedAt: string;
    feedbackText: string;
    rating: string;
}


export interface LecturerPerformanceChart {
    "criterion_name":string,
    "average_score":number,
}

// This represents the raw data shape from your API
export interface LecturerPerformanceChartAPI {
    criterion_name: string;
    average_score: string; // APIs often send decimal/numeric types as strings
}
