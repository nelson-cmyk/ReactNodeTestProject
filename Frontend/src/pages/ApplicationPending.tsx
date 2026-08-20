import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function ApplicationPending() {

    const [applications, setApplications] =
        useState<any[]>([]);

    const navigate = useNavigate();


    // =========================================
    // Load Pending Applications
    // =========================================

    useEffect(() => {

        loadApplications();

    }, []);


    const loadApplications = async () => {
        try {

            const response = await api.get(
                "/applications/pending"
            );
                    
            console.log(
                "Pending Applications:",
                response.data
            );

            setApplications(response.data);

        }
        catch (error: any) {

            console.log(
                "Error loading pending applications:",
                error.response?.data ||
                error.message
            );

        }

    };


    // =========================================
    // Get Service Name
    // =========================================

    const getServiceName = (
        workflowId: number
    ) => {

        switch (workflowId) {

            case 1:
                return "Housing";

            case 2:
                return "Boiler";

            default:
                return "Unknown Service";

        }

    };


    // =========================================
    // Get Service Details
    // =========================================

    const getServiceDetails = (
        application: any
    ) => {

        switch (application.workflow_id) {

            case 1:

                return (
                    application.house_type ||
                    "-"
                );


            case 2:

                return (
                    application.boiler_type ||
                    "-"
                );


            default:

                return "-";

        }

    };


    // =========================================
    // Render
    // =========================================

    return (

        <div>

            <h2>
                Pending Applications
            </h2>


            <table
                border={1}
                cellPadding={10}
            >

                <thead>

                    <tr>

                        <th>
                            Application No
                        </th>

                        <th>
                            Service
                        </th>

                        <th>
                            Applicant
                        </th>

                        <th>
                            Mobile
                        </th>

                        <th>
                            Details
                        </th>

                        <th>
                            Action
                        </th>

                    </tr>

                </thead>


                <tbody>

                    {applications.length === 0 ? (

                        <tr>

                            <td
                                colSpan={6}
                                style={{
                                    textAlign: "center"
                                }}
                            >
                                No pending applications
                            </td>

                        </tr>

                    ) : (

                        applications.map(
                            (app) => (

                                <tr
                                    key={
                                        app.task_id
                                    }
                                >

                                    <td>
                                        {
                                            app.application_no
                                        }
                                    </td>


                                    <td>
                                        {
                                            getServiceName(
                                                Number(
                                                    app.workflow_id
                                                )
                                            )
                                        }
                                    </td>


                                    <td>
                                        {
                                            app.applicant_name
                                        }
                                    </td>


                                    <td>
                                        {
                                            app.mobile_number
                                        }
                                    </td>


                                    <td>
                                        {
                                            getServiceDetails(
                                                app
                                            )
                                        }
                                    </td>


                                    <td>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/workflow/application/${app.application_id}`
                                                )
                                            }
                                        >
                                            Open
                                        </button>

                                    </td>

                                </tr>

                            )
                        )

                    )}

                </tbody>

            </table>

        </div>

    );

}

export default ApplicationPending;