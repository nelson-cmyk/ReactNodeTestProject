import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

import "../css/EServices.css";

function EServices() {

    const [services, setServices] = useState<any[]>([]);

    const navigate = useNavigate();


    useEffect(() => {

        loadServices();

    }, []);


    const loadServices = async () => {

        try {

            const response = await api.get(
                "/services",
                
            );

            console.log(
                "Services:",
                response.data
            );

            setServices(response.data);

        }
        catch (error) {

            console.error(
                "Error loading services:",
                error
            );

        }

    };


    return (

        <div className="services-container">

            <h2>
                e-Services
            </h2>


            <div className="services-grid">

                {services.map(
                    (service: any) => (

                        <button
                            key={service.service_id}

                            className="service-card"

                            onClick={() => {

                                navigate(
                                    service.route,
                                    {
                                        state: {
                                            workflowId:
                                                service.workflow_id
                                        }
                                    }
                                );

                            }}
                        >

                            {service.service_name}

                        </button>

                    )
                )}

            </div>

        </div>

    );

}

export default EServices;