import * as z from "zod";
import {CourseOffering, CourseOfferingWithDetails} from "@/lib/types/course-offering";
import {Criterion} from "@/lib/types/criterion";

export const feedbackFormSchema = z.object({
    courseId: z.string().min(1, "Course ID is required"), // Hidden field, but important
    courseName: z.string(), // For display purposes on the form

    overallRating: z.coerce // coerce will attempt to convert string from radio/select to number
        .number({ invalid_type_error: "Please select an overall rating." })
        .min(1, "Rating must be at least 1.")
        .max(5, "Rating cannot exceed 5."),

    instructorClarity: z.coerce
        .number({ invalid_type_error: "Please rate instructor clarity." })
        .min(1).max(5),

    courseRelevance: z.coerce
        .number({ invalid_type_error: "Please rate course relevance." })
        .min(1).max(5),

    workload: z.coerce
        .number({ invalid_type_error: "Please rate the workload." })
        .min(1).max(5),

    likedMost: z.string()
        .min(10, { message: "Please provide at least 10 characters." })
        .max(500, { message: "Response cannot exceed 500 characters." })
        .optional().or(z.literal('')), // Optional, but if provided, must meet criteria

    suggestionsForImprovement: z.string()
        .min(10, { message: "Please provide at least 10 characters." })
        .max(500, { message: "Response cannot exceed 500 characters." })
        .optional().or(z.literal('')),

    comments: z.string()
        .max(1000, { message: "Comments cannot exceed 1000 characters." })
        .optional().or(z.literal('')),
});


export const updateProfileFormSchema = z.object({
    fullName: z.string().min(2, {
        message: "Full name must be at least 2 characters.",
    }),
    // Email is typically not editable directly here or requires verification
});

export const changePasswordFormSchema = z.object({
    currentPassword: z.string().min(6, { // Adjust min length as per your rules
        message: "Current password is required.",
    }),
    newPassword: z.string().min(8, {
        message: "New password must be at least 8 characters.",
    }),
    confirmNewPassword: z.string().min(8),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords don't match.",
    path: ["confirmNewPassword"], // Path of error
});



// Define the validation schema(for sign up)
export const baseSignUpSchema = z.object({
    fullName: z.string().min(2, {
        message: "Full name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(4, {
        message: "Password must be at least 8 characters.",
    }),
    // You could add confirmPassword here if needed:
    confirmPassword: z.string().min(4),
})

export const studentFormSchema = baseSignUpSchema.extend({
    facultyId: z.string({ required_error: "Please select a faculty." }).min(1, "Please select a faculty."),
    departmentId: z.string({ required_error: "Please select a department." }).min(1, "Please select a department."),

    // NEW: Added matric number field
    matricNumber: z.string({ required_error: "Matric number is required." })
        .min(1, "Matric number is required."),

    // NEW: Added level field, which will be converted to a number
    level: z.coerce.number({ required_error: "Please select your level." })
        .min(100, "Please select your level."),

})
export const lecturerFormSchema = baseSignUpSchema.extend({
    facultyId: z.string({ required_error: "Please select a faculty." }).min(1, "Please select a faculty."),
    departmentId: z.string({ required_error: "Please select a department." }).min(1, "Please select a department."),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

// Define the validation schema
export const loginFormSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(4, {
        message: "Password must be at least 6 characters.",
    }),
});



export const facultyFormSchema = z.object({
    name: z.string().min(2, { message: "Faculty name must be at least 2 characters." })
});

export const departmentFormSchema = z.object({
    name: z.string().min(2, { message: "Department name must be at least 2 characters." }),
    faculty_id: z.string().min(1, { message: "Faculty is required." })
});


export const questionBuilderSchema = z.object({
    id: z.string().optional(), // Internal ID from useFieldArray
    question_text: z.string().min(10, { message: "Question text must be at least 10 characters." }),
    question_type: z.enum(['rating', 'slider', 'text']),
    // Corrected to 'criteria_id' and stored as a string from the Select component
    criteria_id: z.string().min(1, { message: "Please select a criterion." }),
});

// Schema for the entire questionnaire form
export const questionnaireBuilderSchema = z.object({
    title: z.string().min(5, { message: "Title must be at least 5 characters long." }),
    // New top-level fields
    course_offering_id: z.string().min(1, { message: "Please select a course offering." }),
    feedback_round: z.coerce.number().min(1, { message: "Please select a feedback round." }),
    status: z.enum(['inactive', 'active'], { required_error: "Please select an initial status." }),
    // Ensure at least one question is added
    questions: z.array(questionBuilderSchema).min(1, { message: "Please add at least one question." }),
});




// Defines the shape of a single question from your API
export type QuestionnaireQuestion = {
    id: number;
    question_text: string;
    question_type: "rating" | "slider" | "text"; // Constrain to known types
    order: number;
    criterion:Criterion;
};

// Defines the shape of the entire questionnaire object from your API
export type Questionnaire2 = {
    id: number;
    title: string;
    status: "active" | "inactive" | "draft"; // Constrain to known statuses
    course_offering:CourseOfferingWithDetails
    questions: QuestionnaireQuestion[];
    // You can add other fields like 'course_offering' if needed by the form
};


export type FeedbackAnswer = {
    id: number;
    answer_value: number | null;
    answer_text: string | null;
    submitted_at: string;
};

export type PaginationInfo = {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
};

export type PaginatedFeedbackResponse = {
    data: FeedbackAnswer[];
    pagination: PaginationInfo;
};



// --- Dynamic Zod Schema Generation ---

// This is the function you provided, slightly adapted for our new types.
// It creates a schema for an *array* of answers.
const createAnswerArraySchema = (questions: QuestionnaireQuestion[]) => {
    return z.array(
        z.object({
            question_id: z.number(),
            // We'll make both optional here and let the refine logic handle what's required.
            answer_text: z.string().optional(),
            answer_value: z.number().optional(),
        }).refine((data) => {
            const question = questions.find(q => q.id === data.question_id);
            if (!question) return false; // Question doesn't exist

            const { question_type } = question;

            // Logic for "text" type questions
            if (question_type === "text") {
                // Must be a non-empty string
                return typeof data.answer_text === "string" && data.answer_text.trim().length > 0;
            }

            // Logic for "slider" and "rating" types
            if (question_type === "slider") {
                return typeof data.answer_value === "number" && data.answer_value >= 1 && data.answer_value <= 100;
            }

            if (question_type === "rating") {
                return typeof data.answer_value === "number" && data.answer_value >= 1 && data.answer_value <= 5;
            }

            return false; // Fails if type is unknown or conditions aren't met
        }, {
            // This is a generic message. We can improve it later if needed.
            message: "Invalid answer provided for the question type.",
        })
    );
};


// This creates the schema for the *entire form*
export const createDynamicFeedbackFormSchema = (questions: QuestionnaireQuestion[]) => {
    return z.object({
        questionnaire_id: z.number(),
        // The form data will have a nested 'answers' array
        answers: createAnswerArraySchema(questions),
    });
}

// Inferred TypeScript type for our form data
export type DynamicFeedbackFormData = z.infer<ReturnType<typeof createDynamicFeedbackFormSchema>>;

export type QuestionnaireBuilderData = z.infer<typeof questionnaireBuilderSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileFormSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordFormSchema>;
export type FeedbackFormData = z.infer<typeof feedbackFormSchema>;
export type FacultyFormData = z.infer<typeof facultyFormSchema>;
export type DepartmentFormData = z.infer<typeof departmentFormSchema>;
