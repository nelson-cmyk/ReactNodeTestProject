import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import "../css/Tables.css";

interface Props {
    workflowId?: number;
}

function SubmittedList({ workflowId = 1 }: Props) {

    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        loadApplications();

    }, [workflowId]);


    const loadApplications = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(

                `http://localhost:5000/api/applications/submitted/${workflowId}`,

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            console.log(
                "Submitted Applications:",
                response.data
            );

            setApplications(response.data);

        }
        catch (error) {

            console.error(
                "Error loading submitted applications:",
                error
            );

        }
        finally {

            setLoading(false);

        }

    };


    /* =========================================
       Loading
       ========================================= */

    if (loading) {

        return (
            <div className="empty-state">
                Loading submitted applications...
            </div>
        );

    }


    /* =========================================
       No Applications
       ========================================= */

    if (applications.length === 0) {

        return (

            <div className="common-table-wrapper">

                <table className="common-table">

                    <thead>

                        <tr>
                            <th>Application No</th>
                            <th>Status</th>
                            <th>Current State</th>
                            <th>Action</th>
                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td
                                colSpan={4}
                                className="empty-row"
                            >
                                No Submitted Applications
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        );

    }


    /* =========================================
       Application Table
       ========================================= */

    return (

        <div className="common-table-wrapper">

            <table className="common-table">

                <thead>

                    <tr>

                        <th>
                            Application No
                        </th>

                        <th>
                            Status
                        </th>

                        <th>
                            Current State
                        </th>

                        <th>
                            Action
                        </th>

                    </tr>

                </thead>


                <tbody>

                    {applications.map(
                        (application: any) => (

                            <tr
                                key={
                                    application.application_id
                                }
                            >

                                <td className="application-number">

                                    {
                                        application.application_no
                                    }

                                </td>


                                <td>

                                    {
                                        application.application_status
                                    }

                                </td>


                                <td>

                                    {
                                        application.state_name
                                    }

                                </td>


                                <td>

                                    <Link
                                        className="table-action"
                                        to={`/workflow/application/${application.application_id}`}
                                    >
                                        View
                                    </Link>

                                </td>

                            </tr>

                        )
                    )}

                </tbody>

            </table>

        </div>

    );

}

export default SubmittedList;