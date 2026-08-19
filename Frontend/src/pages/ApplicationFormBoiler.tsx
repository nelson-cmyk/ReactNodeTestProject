//As per boiler application form

import { useState, useEffect } from "react";
import axios from "axios";
import "../css/ApplicationForm.css";
import { useNavigate } from "react-router-dom";
import { type BoilerFormData } from "../../../shared/schemas/boilerSchema";

import {
    validateBoilerForm,
    type BoilerFormErrors,
} from "../validation/ApplicationFormBoilerValidation";

interface BoilerApplicationFormProps {
    applicationId?: string;
}

interface BoilerFiles {
    boiler_certificate?: File;
}

function BoilerApplicationForm({ applicationId }: BoilerApplicationFormProps) {
const [formData, setFormData] =
    useState<BoilerFormData>({
        applicant_name: "",
        mobile_number: "",
        address: "",
        boiler_type: "",
        boiler_capacity: "",
        year_of_installation: "",
        purpose: "",
    });

const [errors, setErrors] =
    useState<BoilerFormErrors>({});
const navigate = useNavigate();
const [files, setFiles] = useState<BoilerFiles>({});

const [existingCertificate, setExistingCertificate] =
    useState<string>("");

const handleChange = (
    e: React.ChangeEvent<
        HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
    >
) => {

    const { name, value } = e.target;
// =========================================
    // Mobile number: allow digits only
    // =========================================
 console.log(
        "HANDLE CHANGE:",
        name,
        value,
        typeof value
    );

    if (name === "mobile_number") {

        if (!/^\d*$/.test(value)) {
            return;
        }

    }
    setFormData((prev) => ({
        ...prev,
        [name]: value,
    }));

    setErrors((prev) => ({
        ...prev,
        [name]: "",
    }));
};





useEffect(() => {

    if (!applicationId) {
        return;
    }
    
    const loadDraft = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const response = await axios.get(
                `http://localhost:5000/api/applications/boiler/edit/${applicationId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            console.log(
                "FULL API RESPONSE:",
                response.data
            );

            // =========================================
            // IMPORTANT
            // Data is inside response.data.application
            // =========================================

            const application =
                response.data.application;

            console.log(
                "APPLICATION DATA:",
                application
            );

            console.log(
                "Applicant:",
                application.applicant_name
            );

            console.log(
                "Mobile:",
                application.mobile_number
            );

            console.log(
                "Address:",
                application.address
            );

            console.log(
                "Boiler Type:",
                application.boiler_type
            );

            console.log(
                "Boiler Capacity:",
                application.boiler_capacity
            );

            console.log(
                "Year:",
                application.year_of_installation
            );

            console.log(
                "Purpose:",
                application.purpose
            );


          setFormData({
    applicant_name:
        String(application.applicant_name ?? ""),

    mobile_number:
        String(application.mobile_number ?? ""),

    address:
        String(application.address ?? ""),

    boiler_type:
        String(application.boiler_type ?? ""),

    boiler_capacity:
        String(application.boiler_capacity ?? ""),

    year_of_installation:
        String(application.year_of_installation ?? ""),

    purpose:
        String(application.purpose ?? "")
});
setExistingCertificate(
    application.boiler_certificate ?? ""
);
        }
        catch (error: any) {

            console.log(
                "Error loading boiler draft:",
                error.response?.data ||
                error.message
            );

        }

    };

    loadDraft();

}, [applicationId]);

const handleFile = (
    e: React.ChangeEvent<HTMLInputElement>
) => {

    const file = e.target.files?.[0];

    if (!file) {
        return;
    }

    setFiles({
        boiler_certificate: file
    });

    setErrors((prev) => ({
        ...prev,
        boiler_certificate: ""
    }));
};

const saveDraft = async () => {

    // =========================================
    // 1. Create FormData
    // =========================================

    const data = new FormData();

    (Object.keys(formData) as Array<keyof BoilerFormData>)
        .forEach((key) => {

            data.append(
                key,
                formData[key]
            );

        });

    // =========================================
    // 2. Existing application/draft ID
    // =========================================

    if (applicationId) {

        data.append(
            "application_id",
            applicationId
        );

    }

    // =========================================
    // 3. Certificate
    // =========================================

    if (files.boiler_certificate) {

        data.append(
            "boiler_certificate",
            files.boiler_certificate
        );

    }

    // =========================================
    // 4. Send draft to backend
    // =========================================

    try {

        const token =
            localStorage.getItem("token");

        const response = await axios.post(
            "http://localhost:5000/api/applications/boiler/draft",
            data,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

        console.log(
            "Save Draft Response:",
            response.data
        );

        alert(
            response.data.message
        );

    }
    catch (error: any) {

        console.log(
            "Save Draft Error:",
            error.response?.data ||
            error.message
        );

        alert(
            "Draft save failed"
        );

    }
};



const submitForm = async (
    e: React.FormEvent<HTMLFormElement>
) => {

    e.preventDefault();
console.log(
        "FORM DATA:",
        formData
    );

    console.log(
        "SELECTED FILE:",
        files.boiler_certificate
    );

    console.log(
        "EXISTING CERTIFICATE:",
        existingCertificate
    );
console.log("FORM DATA BEFORE VALIDATION:", formData);

console.log(
    "YEAR VALUE:",
    formData.year_of_installation
);
console.log(
    "YEAR TYPE:",
    typeof formData.year_of_installation
);
    // =========================================
    // 1. Validate form
    // =========================================

    const validationErrors =
        validateBoilerForm(
            formData,
            files.boiler_certificate,
            existingCertificate
        );
 console.log(
        "VALIDATION ERRORS:",
        validationErrors
    );
    // =========================================
    // 2. Display validation errors
    // =========================================

    if (Object.keys(validationErrors).length > 0) {

        setErrors(validationErrors);
          
        // Show first validation error
    alert(
        Object.values(validationErrors)[0]
    );

        return;
    }

    // Validation successful
    setErrors({});

    console.log(
        "Validation successful:",
        formData
    );

    // =========================================
    // 3. Create FormData
    // =========================================

    const data = new FormData();

    (Object.keys(formData) as Array<keyof BoilerFormData>)
        .forEach((key) => {

            data.append(
                key,
                formData[key]
            );

        });

    // =========================================
    // 4. Existing application/draft ID
    // =========================================

    if (applicationId) {

        data.append(
            "application_id",
            applicationId
        );

    }

    // =========================================
    // 5. Certificate
    // =========================================

    if (files.boiler_certificate) {

        data.append(
            "boiler_certificate",
            files.boiler_certificate
        );

    }

    // =========================================
    // 6. Submit to backend
    // =========================================

    try {

        const token =
            localStorage.getItem("token");

        const response = await axios.post(
            "http://localhost:5000/api/applications/boiler",
            data,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
 
               
                }
            }
        );

        console.log(
            "Submit Response:",
            response.data
        );

        alert(
            response.data.message
        );

        navigate("/dashboard");

    }
    catch (error: any) {

        console.log(
            "Submit Error:",
            error.response?.data ||
            error.message
        );

        alert(
            "Submission failed"
        );

    }

};




return (

<div className="application-container">


<h2>
Boiler Inspection Application
</h2>



<form onSubmit={submitForm}>


<label>
Applicant Name
</label>

<input

name="applicant_name"

value={formData.applicant_name}

onChange={handleChange}

/>
{errors.applicant_name && (
    <span className="field-error">
        {errors.applicant_name}
    </span>
)}


<label>
Mobile Number
</label>


<input
type="tel"

name="mobile_number"

maxLength={10}

value={formData.mobile_number}

onChange={handleChange}

/>
{errors.mobile_number && (
    <span className="field-error">
        {errors.mobile_number}
    </span>
)}


<label>
Address
</label>


<textarea

name="address"

value={formData.address}

onChange={handleChange}

/>
{errors.address && (
    <span className="field-error">
        {errors.address}
    </span>
)}


<label>
Boiler Type
</label>


<select

name="boiler_type"

value={formData.boiler_type}

onChange={handleChange}

>


<option value="">
Select
</option>


<option value="Steam Boiler">
Steam Boiler
</option>


<option value="Hot Water Boiler">
Hot Water Boiler
</option>


<option value="Industrial Boiler">
Industrial Boiler
</option>


</select>



{errors.boiler_type && (
    <span className="field-error">
        {errors.boiler_type}
    </span>
)}

<label>
Boiler Capacity (TPH)
</label>


<input

type="number"

name="boiler_capacity"

value={formData.boiler_capacity}

onChange={handleChange}

/>
{errors.boiler_capacity && (
    <span className="field-error">
        {errors.boiler_capacity}
    </span>
)}




<label>
Year of Installation
</label>


<input

type="number"

name="year_of_installation"

value={formData.year_of_installation}

onChange={handleChange}

/>
{errors.year_of_installation && (
    <span className="field-error">
        {errors.year_of_installation}
    </span>
)}




<label>
Purpose
</label>


<textarea

name="purpose"

value={formData.purpose}

onChange={handleChange}

/>
{errors.purpose && (
    <span className="field-error">
        {errors.purpose}
    </span>
)}


<label>Upload Boiler Certificate</label>

{existingCertificate && (
    <div className="existing-file-container">
        <span className="file-name">
            {existingCertificate}
        </span>

        <a
            href={`http://localhost:5000/uploads/${existingCertificate}`}
            target="_blank"
            rel="noreferrer"
            className="view-file-button"
        >
            View Certificate
        </a>
    </div>
)}

<input
    type="file"
    name="boiler_certificate"
    onChange={handleFile}
/>
{errors.boiler_certificate && (
    <span className="field-error">
        {errors.boiler_certificate}
    </span>
)}




<button

type="button"

onClick={saveDraft}

>

Save Draft

</button>



<button

type="submit"

>

Submit Application

</button>



</form>



</div>

);


}


export default BoilerApplicationForm;