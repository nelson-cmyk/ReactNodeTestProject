import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Props {
    workflowId?: number;
}

function SubmittedList({ workflowId = 1 }: Props) {

    const [applications, setApplications] = useState<any[]>([]);

    useEffect(() => {
        loadApplications();
    }, []);

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

            setApplications(response.data);

        }
        catch (error) {

            console.log(error);

        }

    };

    if (applications.length === 0) {

        return <h4>No Submitted Applications</h4>;

    }

    return (

        <table className="table">

            <thead>

                <tr>

                    <th>Application No</th>
                    <th>Status</th>
                    <th>Current State</th>
                    <th>Action</th>

                </tr>

            </thead>

            <tbody>

                {

                    applications.map((application: any) => (

                        <tr key={application.application_id}>

                            <td>{application.application_no}</td>

                            <td>{application.application_status}</td>

                            <td>{application.state_name}</td>

                            <td>

                                <Link
                                    to={`/workflow/application/${application.application_id}`}
                                >
                                    View
                                </Link>

                            </td>

                        </tr>

                    ))

                }

            </tbody>

        </table>

    );

}

export default SubmittedList;