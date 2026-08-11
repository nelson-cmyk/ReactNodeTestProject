import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import ApplicationForm from "./ApplicationForm";
import BoilerApplicationForm from "./BoilerApplicationForm";

function ApplicationEdit() {

    const { applicationId } = useParams();

    const [workflowId, setWorkflowId] =
        useState<number | null>(null);

    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        const loadApplication = async () => {

            try {

                const token =
                    localStorage.getItem("token");

                console.log(
                    "Application ID:",
                    applicationId
                );


                const response =
                    await axios.get(
                        `http://localhost:5000/api/applications/${applicationId}`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );


                console.log(
                    "Application:",
                    response.data
                );


                setWorkflowId(
                    response.data.workflow_id
                );

            }
            catch (error) {

                console.log(
                    "Error loading application:",
                    error
                );

            }
            finally {

                setLoading(false);

            }

        };


        if (applicationId) {

            loadApplication();

        }

    }, [applicationId]);


    if (loading) {

        return (
            <div>
                Loading application...
            </div>
        );

    }


    if (workflowId === 1) {

        return (
            <ApplicationForm />
        );

    }


    if (workflowId === 2) {

        return (
            <BoilerApplicationForm />
        );

    }


    return (
        <div>
            Invalid workflow
        </div>
    );

}

export default ApplicationEdit;