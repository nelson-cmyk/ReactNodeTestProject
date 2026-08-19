import {
    boilerSchema,
    boilerCertificateSchema,
    type BoilerFormData,
} from "../../../shared/schemas/boilerSchema";

export type BoilerFormErrors = Partial<
    Record<
        keyof BoilerFormData | "boiler_certificate",
        string
    >
>;

export const validateBoilerForm = (
    formData: BoilerFormData,
    certificate?: File,
    existingCertificate?: string
): BoilerFormErrors => {

    const errors: BoilerFormErrors = {};

    // -----------------------------------------
    // Validate normal form fields
    // -----------------------------------------

    const formResult =
        boilerSchema.safeParse(formData);

    if (!formResult.success) {

        formResult.error.issues.forEach((issue) => {

            const field =
                issue.path[0] as keyof BoilerFormData;

            if (!errors[field]) {
                errors[field] = issue.message;
            }

        });
    }

    // -----------------------------------------
    // Validate certificate
    // -----------------------------------------

    if (certificate) {

        const certificateResult =
            boilerCertificateSchema.safeParse(
                certificate
            );

        if (!certificateResult.success) {

            errors.boiler_certificate =
                certificateResult
                    .error
                    .issues[0]
                    .message;
        }

    } else if (!existingCertificate) {

        errors.boiler_certificate =
            "Boiler certificate is required";
    }

    return errors;
};