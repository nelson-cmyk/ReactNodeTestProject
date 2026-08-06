import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function EServices() {

    const [services, setServices] = useState<any[]>([]);

    const navigate = useNavigate();   // ✅ inside component


    useEffect(() => {

        loadServices();

    }, []);



    const loadServices = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/services",
                {
                    headers: {
                        Authorization:`Bearer ${token}`
                    }
                }
            );

            setServices(response.data);

        }
        catch(error){

            console.log(error);

        }

    };



    return (

        <div className="services-container">

            <h2>
                e-Services
            </h2>


            {
                services.map((service:any)=>(

                    <button

                        key={service.service_id}

                        onClick={() =>

                            navigate(

                                service.route,

                                {
                                    state:{
                                        workflowId:
                                        service.workflow_id
                                    }
                                }

                            )

                        }

                    >

                        {service.service_name}

                    </button>

                ))
            }


        </div>

    );

}


export default EServices;