import {useState, useEffect} from "react";
import axios from "axios";
import "../css/ApplicationForm.css";


function ApplicationForm(){


const [formData,setFormData]=useState<any>({

applicant_name:"",
mobile_number:"",
address:"",
house_type:"Residential",
annual_income:""

});

const [existingFiles, setExistingFiles] = useState({
    income_certificate: "",
    address_proof: ""
});
useEffect(() => {

    const loadDraft = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/applications/housing/draft",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.hasDraft) {
console.log("Draft Response:", response.data);
                setFormData({
                    applicant_name: response.data.application.applicant_name,
                    mobile_number: response.data.application.mobile_number,
                    address: response.data.application.address,
                    house_type: response.data.application.house_type,
                    annual_income: response.data.application.annual_income
                });


    setExistingFiles({
    income_certificate: response.data.application.income_certificate,
    address_proof: response.data.application.address_proof
});

           
            }

        } catch (err) {
            console.log(err);
        }

    };

    loadDraft();

}, []);
const [files,setFiles]=useState<any>({});



const handleChange=(e:any)=>{

setFormData({

...formData,

[e.target.name]:e.target.value

});

};



const handleFile=(e:any)=>{
 console.log(
        "File selected:",
        e.target.name,
        e.target.files[0]
    );

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


    if(files.income_certificate){
        data.append(
            "income_certificate",
            files.income_certificate
        );
    }


    if(files.address_proof){
        data.append(
            "address_proof",
            files.address_proof
        );
    }




    try {

        const token = localStorage.getItem("token");


        const response = await axios.post(
            "http://localhost:5000/api/applications/draft",
            data,
            {
                headers:{
                    Authorization:`Bearer ${token}`,
                    "Content-Type":"multipart/form-data"
                }
            }
        );


        console.log(response.data);

        alert("Application saved as draft");


    }
    catch(error:any){

        console.log(
            error.response?.data || error.message
        );

        alert("Draft save failed");

    }

};

const submitForm=async(e:any)=>{

e.preventDefault();


const data=new FormData();


Object.keys(formData).forEach(key=>{

data.append(
key,
formData[key]
);

});


data.append(
"income_certificate",
files.income_certificate
);


data.append(
"address_proof",
files.address_proof
);



try {

    const token = localStorage.getItem("token");

    console.log("Token:", token);


    const response = await axios.post(
        "http://localhost:5000/api/applications",
        data,
        {
            headers:{
                Authorization:`Bearer ${token}`,
                "Content-Type":"multipart/form-data"
            }
        }
    );


    console.log(
        "API Response:",
        response.data
    );


    alert(
        response.data.message
    );


}
catch(error:any){

    console.log(
        "Submission Error:",
        error.response?.data || error.message
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

<option>
Residential
</option>

<option>
Commercial
</option>

<option>
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

{
existingFiles.income_certificate && (

<div className="existing-file">

    <span>
        {existingFiles.income_certificate}
    </span>

    <a
        className="view-button"
        href={`http://localhost:5000/uploads/${existingFiles.income_certificate}`}
        target="_blank"
        rel="noopener noreferrer"
    >
        View
    </a>

</div>

)
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
existingFiles.address_proof && (

<div className="existing-file">

    <span>
        {existingFiles.address_proof}
    </span>

    <a
        className="view-button"
        href={`http://localhost:5000/uploads/${existingFiles.address_proof}`}
        target="_blank"
        rel="noopener noreferrer"
    >
        View
    </a>

</div>

)
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