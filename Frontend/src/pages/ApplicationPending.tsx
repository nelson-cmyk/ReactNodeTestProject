import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ApplicationPending(){

    const [applications,setApplications]=useState<any[]>([]);

    const navigate=useNavigate();

    useEffect(()=>{

        loadApplications();

    },[]);

    const loadApplications=async()=>{

        const token=localStorage.getItem("token");

        try {

    const response = await axios.get(
        "http://localhost:5000/api/applications/pending",
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );

    setApplications(response.data);

        }
catch(error:any){

    console.log(error);
}
};

   

    return(

        <div>

            <h2>Pending Applications</h2>

            <table border={1} cellPadding={10}>

                <thead>

                    <tr>

                        <th>Application No</th>

                        <th>Applicant</th>

                        <th>Mobile</th>

                        <th>House Type</th>

                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                {

                    applications.map(app=>(

                        <tr key={app.application_id}>

                            <td>{app.application_no}</td>

                            <td>{app.applicant_name}</td>

                            <td>{app.mobile_number}</td>

                            <td>{app.house_type}</td>

                            <td>

                                <button

                                onClick={()=>

                                    navigate(

                                        "/workflow/application/"+app.application_id

                                    )

                                }

                                >

                                    Open

                                </button>

                            </td>

                        </tr>

                    ))

                }

                </tbody>

            </table>

        </div>

    );

}

export default ApplicationPending;