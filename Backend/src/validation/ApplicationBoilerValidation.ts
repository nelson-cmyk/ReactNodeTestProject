import {
    boilerSchema,
} from "../../../shared/schemas/boilerSchema";


// =====================================================
// Form Validation
// =====================================================

export const validateBoilerApplication = (
    formData: unknown
) => {

    const result = boilerSchema.safeParse(formData);

    if (!result.success) {

        return {
            success: false,
            errors: result.error.flatten().fieldErrors,
        };
    }

    return {
        success: true,
        data: result.data,
        errors: {},
    };
};


// =====================================================
// Boiler Certificate Validation
// =====================================================

export const validateBoilerCertificate = (
    file?: Express.Multer.File
): string | null => {

    // File required
    if (!file) {

        return "Boiler certificate is required";
    }


    // Maximum 5 MB
    if (file.size > 5 * 1024 * 1024) {

        return "Certificate must be less than 5 MB";
    }


    // Allowed file types
    const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
    ];

    if (!allowedTypes.includes(file.mimetype)) {

        return "Only PDF, JPG or PNG files are allowed";
    }


    return null;
};