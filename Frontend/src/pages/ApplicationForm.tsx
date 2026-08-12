import { useState, useEffect } from "react";
import axios from "axios";
import "../css/ApplicationForm.css";

interface ApplicationFormProps {
    applicationId?: string;
}

function ApplicationForm({
    applicationId
}: ApplicationFormProps) {

    const [formData, setFormData] = useState<any>({
        applicant_name: "",
        mobile_number: "",
        address: "",
        house_type: "Residential",
        annual_income: ""
    });

    const [existingFiles, setExistingFiles] = useState({
        income_certificate: "",
        address_proof: ""
    });

    const [files, setFiles] = useState<any>({});

    // =========================================
    // Load Application
    // =========================================

    useEffect(() => {

        if (!applicationId) {
            console.log("No application ID");
            return;
        }

        loadApplication(applicationId);

    }, [applicationId]);


    const loadApplication = async (id: string) => {

        try {

            console.log("================================");
            console.log("Loading Housing Application");
            console.log("Application ID:", id);

            const token =
                localStorage.getItem("token");

            const response = await axios.get(
                `http://localhost:5000/api/applications/housing/edit/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("FULL API RESPONSE:");
            console.log(response.data);

            // IMPORTANT:
            // Check whether your controller returns:
            // response.json({ application: row })
            // or
            // response.json(row)

            const app =
                response.data.application ||
                response.data;

            console.log("APPLICATION OBJECT:");
            console.log(app);

            console.log("Applicant Name:", app.applicant_name);
            console.log("Mobile:", app.mobile_number);
            console.log("Address:", app.address);
            console.log("House Type:", app.house_type);
            console.log("Annual Income:", app.annual_income);
            console.log(
                "Income Certificate:",
                app.income_certificate
            );
            console.log(
                "Address Proof:",
                app.address_proof
            );

            // =========================================
            // Set Form Fields
            // =========================================

            setFormData({
                applicant_name:
                    app.applicant_name ?? "",

                mobile_number:
                    app.mobile_number ?? "",

                address:
                    app.address ?? "",

                house_type:
                    app.house_type ?? "Residential",

                annual_income:
                    app.annual_income ?? ""
            });

            // =========================================
            // Existing Files
            // =========================================

            setExistingFiles({
                income_certificate:
                    app.income_certificate ?? "",

                address_proof:
                    app.address_proof ?? ""
            });

        }
        catch (error: any) {

            console.log(
                "ERROR LOADING HOUSING APPLICATION:"
            );

            console.log(
                error.response?.data ||
                error.message
            );

        }

    };


    // =========================================
    // Handle Input
    // =========================================

    const handleChange = (e: any) => {

        const {
            name,
            value
        } = e.target;

        setFormData((previous: any) => ({
            ...previous,
            [name]: value
        }));

    };


    // =========================================
    // Handle File
    // =========================================

    const handleFile = (e: any) => {

        setFiles((previous: any) => ({
            ...previous,
            [e.target.name]:
                e.target.files?.[0]
        }));

    };


    // =========================================
    // Save Draft
    // =========================================

    const saveDraft = async () => {

        const data = new FormData();

        Object.keys(formData).forEach(key => {

            data.append(
                key,
                formData[key]
            );

        });

        if (files.income_certificate) {

            data.append(
                "income_certificate",
                files.income_certificate
            );

        }

        if (files.address_proof) {

            data.append(
                "address_proof",
                files.address_proof
            );

        }

        try {

            const token =
                localStorage.getItem("token");

            const response = await axios.post(
                "http://localhost:5000/api/applications/draft",
                data,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                        "Content-Type":
                            "multipart/form-data"
                    }
                }
            );

            console.log(
                "Draft response:",
                response.data
            );

            alert(
                "Application saved as draft"
            );

        }
        catch (error: any) {

            console.log(
                "Draft error:",
                error.response?.data ||
                error.message
            );

            alert(
                "Draft save failed"
            );

        }

    };


    // =========================================
    // Submit
    // =========================================

    const submitForm = async (e: any) => {

        e.preventDefault();

        const data = new FormData();

        Object.keys(formData).forEach(key => {

            data.append(
                key,
                formData[key]
            );

        });

        if (files.income_certificate) {

            data.append(
                "income_certificate",
                files.income_certificate
            );

        }

        if (files.address_proof) {

            data.append(
                "address_proof",
                files.address_proof
            );

        }

        try {

            const token =
                localStorage.getItem("token");

            const response =
                await axios.post(
                    "http://localhost:5000/api/applications",
                    data,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                            "Content-Type":
                                "multipart/form-data"
                        }
                    }
                );

            console.log(
                "Submit response:",
                response.data
            );

            alert(
                response.data.message
            );

        }
        catch (error: any) {

            console.log(
                "Submission error:",
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
                Housing Application Form
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


                <label>
                    Mobile Number
                </label>

                <input
                    name="mobile_number"
                    maxLength={10}
                    value={formData.mobile_number}
                    onChange={handleChange}
                />


                <label>
                    Address
                </label>

                <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                />


                <label>
                    House Type
                </label>

                <select
                    name="house_type"
                    value={formData.house_type}
                    onChange={handleChange}
                >

                    <option value="Residential">
                        Residential
                    </option>

                    <option value="Commercial">
                        Commercial
                    </option>

                    <option value="Rental">
                        Rental
                    </option>

                </select>


                <label>
                    Annual Income
                </label>

                <input
                    type="number"
                    name="annual_income"
                    value={formData.annual_income}
                    onChange={handleChange}
                />


                <label>
                    Income Certificate
                </label>

                {existingFiles.income_certificate && (

                    <a
                        href={
                            `http://localhost:5000/uploads/${existingFiles.income_certificate}`
                        }
                        target="_blank"
                        rel="noreferrer"
                    >
                        View Existing File
                    </a>

                )}

                <input
                    type="file"
                    name="income_certificate"
                    onChange={handleFile}
                />


                <label>
                    Address Proof
                </label>

                {existingFiles.address_proof && (

                    <a
                        href={
                            `http://localhost:5000/uploads/${existingFiles.address_proof}`
                        }
                        target="_blank"
                        rel="noreferrer"
                    >
                        View Existing File
                    </a>

                )}

                <input
                    type="file"
                    name="address_proof"
                    onChange={handleFile}
                />


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

export default ApplicationForm;