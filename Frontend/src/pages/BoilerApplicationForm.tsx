//As per boiler application form


import { useState } from "react";
import axios from "axios";
import "../css/ApplicationForm.css";


function BoilerApplicationForm() {


const [formData,setFormData] = useState<any>({

    applicant_name:"",
    mobile_number:"",
    address:"",
    boiler_type:"",
    boiler_capacity:"",
    installation_year:"",
    purpose:""

});


const [files,setFiles]=useState<any>({});



const handleChange=(e:any)=>{

    setFormData({

        ...formData,

        [e.target.name]:e.target.value

    });

};



const handleFile=(e:any)=>{

    setFiles({

        ...files,

        [e.target.name]:e.target.files[0]

    });

};



const saveDraft = async()=>{


    const data = new FormData();


    Object.keys(formData).forEach(key=>{

        data.append(
            key,
            formData[key]
        );

    });



    if(files.boiler_certificate)
    {
        data.append(
            "boiler_certificate",
            files.boiler_certificate
        );
    }



    try{

        const token = localStorage.getItem("token");


        const response = await axios.post(

            "http://localhost:5000/api/applications/boiler/draft",

            data,

            {

                headers:{

                    Authorization:`Bearer ${token}`,

                    "Content-Type":"multipart/form-data"

                }

            }

        );

console.log(response.data);
        alert(response.data.message);


    }
    catch(error:any){

        console.log(error.response?.data);

        alert("Draft save failed");

    }


};




const submitForm=async(e:any)=>{

e.preventDefault();


const data = new FormData();



Object.keys(formData).forEach(key=>{

    data.append(
        key,
        formData[key]
    );

});



if(files.certificate)
{
    data.append(
        "certificate",
        files.certificate
    );
}



try{


const token = localStorage.getItem("token");


const response = await axios.post(

    "http://localhost:5000/api/applications/boiler",

    data,

    {

        headers:{

            Authorization:`Bearer ${token}`,

            "Content-Type":"multipart/form-data"

        }

    }

);


alert(response.data.message);


}
catch(error:any){

console.log(error.response?.data);

alert("Submission failed");

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

name="installation_year"

value={formData.installation_year}

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





<label>
Upload Boiler Certificate
</label>


<input

type="file"

name="certificate"

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