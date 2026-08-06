import { useState, useEffect } from "react";
import axios from "axios";
import "../css/ApplicationForm.css";
import { useParams } from "react-router-dom";




function ApplicationForm() {


    const { applicationId } = useParams();


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



    // ===============================
    // Load Draft / Edit Application
    // ===============================

    useEffect(() => {


        if(applicationId)
        {   console.log("Calling loadApplication");
            loadApplication(applicationId);
        }
        


    }, [applicationId]);





    // ===============================
    // Load Application By ID
    // ===============================

    const loadApplication = async(id:string)=>{


        try{

console.log("Loading application:", id);
            const token =
            localStorage.getItem("token");



            const response = await axios.get(

                `http://localhost:5000/api/applications/housing/${id}`,

                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }

            );


console.log(
    "API RESPONSE:",
    response.data
);
            const app=response.data;



            setFormData({

                applicant_name:app.applicant_name,
                mobile_number:app.mobile_number,
                address:app.address,
                house_type:app.house_type,
                annual_income:app.annual_income

            });



            setExistingFiles({

                income_certificate:
                app.income_certificate,

                address_proof:
                app.address_proof

            });


        }
        catch(error)
        {

            console.log(error);

        }


    };





    const handleChange=(e:any)=>{


        setFormData({

            ...formData,

            [e.target.name]:
            e.target.value

        });


    };





    const handleFile=(e:any)=>{


        setFiles({

            ...files,

            [e.target.name]:
            e.target.files[0]

        });


    };





    // ===============================
    // Save Draft
    // ===============================

    const saveDraft = async()=>{


        const data=new FormData();



        Object.keys(formData).forEach(key=>{


            data.append(

                key,

                formData[key]

            );


        });



        if(files.income_certificate)
        {

            data.append(

                "income_certificate",

                files.income_certificate

            );

        }



        if(files.address_proof)
        {

            data.append(

                "address_proof",

                files.address_proof

            );

        }



        try{


            const token=
            localStorage.getItem("token");



            await axios.post(

                "http://localhost:5000/api/applications/draft",

                data,

                {

                    headers:{

                        Authorization:
                        `Bearer ${token}`,

                        "Content-Type":
                        "multipart/form-data"

                    }

                }

            );


            alert(
                "Application saved as draft"
            );


        }
        catch(error)
        {

            console.log(error);

            alert(
                "Draft save failed"
            );

        }


    };





    // ===============================
    // Submit Application
    // ===============================

    const submitForm=async(e:any)=>{


        e.preventDefault();



        const data=new FormData();



        Object.keys(formData).forEach(key=>{


            data.append(

                key,

                formData[key]

            );


        });



        if(files.income_certificate)
        {
            data.append(
                "income_certificate",
                files.income_certificate
            );
        }



        if(files.address_proof)
        {
            data.append(
                "address_proof",
                files.address_proof
            );
        }



        try{


            const token =
            localStorage.getItem("token");



            const response =
            await axios.post(

                "http://localhost:5000/api/applications",

                data,

                {

                    headers:{

                        Authorization:
                        `Bearer ${token}`,

                        "Content-Type":
                        "multipart/form-data"

                    }

                }

            );



            alert(response.data.message);


        }
        catch(error)
        {

            console.log(error);

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

<option>Residential</option>
<option>Commercial</option>
<option>Rental</option>

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


{
existingFiles.income_certificate &&

<a

href={
`http://localhost:5000/uploads/${existingFiles.income_certificate}`
}

target="_blank"

rel="noreferrer"

>

View Existing File

</a>

}



<input

type="file"

name="income_certificate"

onChange={handleFile}

/>





<label>
Address Proof
</label>


{
existingFiles.address_proof &&

<a

href={
`http://localhost:5000/uploads/${existingFiles.address_proof}`
}

target="_blank"

rel="noreferrer"

>

View Existing File

</a>

}



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