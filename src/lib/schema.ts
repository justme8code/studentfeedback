import * as z from "zod";

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

export type UpdateProfileFormData = z.infer<typeof updateProfileFormSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordFormSchema>;
export type FeedbackFormData = z.infer<typeof feedbackFormSchema>;