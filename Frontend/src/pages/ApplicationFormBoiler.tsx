//As per boiler application form


import { useState, useEffect } from "react";
import axios from "axios";
import "../css/ApplicationForm.css";
import { useNavigate } from "react-router-dom";

interface BoilerApplicationFormProps {
    applicationId?: string;
}

function BoilerApplicationForm({ applicationId }: BoilerApplicationFormProps) {
const [formData,setFormData] = useState<any>({

    applicant_name:"",
    mobile_number:"",
    address:"",
    boiler_type:"",
    boiler_capacity:"",
    year_of_installation:"",
    purpose:""

});

const navigate = useNavigate();
const [files,setFiles]=useState<any>({});

const [existingCertificate, setExistingCertificate] =
    useState<string>("");

const handleChange=(e:any)=>{

    setFormData({

        ...formData,

        [e.target.name]:e.target.value

    });

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
                    application.applicant_name ?? "",

                mobile_number:
                    application.mobile_number ?? "",

                address:
                    application.address ?? "",

                boiler_type:
                    application.boiler_type ?? "",

                boiler_capacity:
                    application.boiler_capacity ?? "",

                year_of_installation:
                    application.year_of_installation ?? "",

                purpose:
                    application.purpose ?? ""

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


const handleFile=(e:any)=>{

    setFiles({

        ...files,

        [e.target.name]:e.target.files[0]

    });

};


const saveDraft = async () => {

    const data = new FormData();

    Object.keys(formData).forEach(key => {

        data.append(
            key,
            formData[key]
        );

    });


    if (applicationId) {

        data.append(
            "application_id",
            applicationId
        );

    }


    if (files.boiler_certificate) {

        data.append(
            "boiler_certificate",
            files.boiler_certificate
        );

    }


    try {

        const token =
            localStorage.getItem("token");

        const response = await axios.post(
            "http://localhost:5000/api/applications/boiler/draft",
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
            "Save Draft Response:",
            response.data
        );

        alert(response.data.message);

    }
    catch (error: any) {

        console.log(
            "Save Draft Error:",
            error.response?.data ||
            error.message
        );

        alert("Draft save failed");

    }

};



const submitForm = async (e: any) => {

    e.preventDefault();

    const data = new FormData();

    Object.keys(formData).forEach(key => {

        data.append(
            key,
            formData[key]
        );

    });


    // Existing draft/application
    if (applicationId) {

        data.append(
            "application_id",
            applicationId
        );

    }


    if (files.boiler_certificate) {

        data.append(
            "boiler_certificate",
            files.boiler_certificate
        );

    }


    try {

        const token =
            localStorage.getItem("token");

        const response = await axios.post(
            "http://localhost:5000/api/applications/boiler",
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


<option>
Steam Boiler
</option>


<option>
Hot Water Boiler
</option>


<option>
Industrial Boiler
</option>


</select>





<label>
Boiler Capacity (TPH)
</label>


<input

type="number"

name="boiler_capacity"

value={formData.boiler_capacity}

onChange={handleChange}

/>





<label>
Year of Installation
</label>


<input

type="number"

name="year_of_installation"

value={formData.year_of_installation}

onChange={handleChange}

/>





<label>
Purpose
</label>


<textarea

name="purpose"

value={formData.purpose}

onChange={handleChange}

/>





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