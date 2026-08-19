import { z } from "zod";

export const boilerSchema = z.object({
    applicant_name: z
        .string()
        .trim()
        .min(1, "Applicant name is required")
        .min(3, "Applicant name must be at least 3 characters")
        .max(100, "Applicant name cannot exceed 100 characters"),

    mobile_number: z
        .string()
        .trim()
        .regex(
            /^[6-9]\d{9}$/,
            "Enter a valid 10-digit mobile number"
        ),

    address: z
        .string()
        .trim()
        .min(1, "Address is required")
        .max(500, "Address cannot exceed 500 characters"),

    boiler_type: z
        .string()
        .min(1, "Please select boiler type"),

    boiler_capacity: z
        .string()
        .min(1, "Boiler capacity is required")
        .refine(
            (value) => !isNaN(Number(value)),
            "Boiler capacity must be a valid number"
        )
        .refine(
            (value) => Number(value) > 0,
            "Boiler capacity must be greater than 0"
        ),

    year_of_installation: z
        .string()
        .min(1, "Year of installation is required")
        .refine(
            (value) => /^\d{4}$/.test(value),
            "Enter a valid 4-digit year"
        )
        .refine(
            (value) => Number(value) >= 1900,
            "Year must be 1900 or later"
        )
        .refine(
            (value) =>
                Number(value) <= new Date().getFullYear(),
            "Year cannot be in the future"
        ),

    purpose: z
        .string()
        .trim()
        .min(1, "Purpose is required")
        .max(500, "Purpose cannot exceed 500 characters"),
});

export const boilerCertificateSchema = z
    .instanceof(File, {
        message: "Boiler certificate is required",
    })
    .refine(
        (file) => file.size <= 5 * 1024 * 1024,
        "Certificate must be less than 5 MB"
    )
    .refine(
        (file) =>
            [
                "application/pdf",
                "image/jpeg",
                "image/png",
            ].includes(file.type),
        "Only PDF, JPG or PNG files are allowed"
    );

export type BoilerFormData =
    z.infer<typeof boilerSchema>;