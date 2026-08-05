import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function WorkflowApplication() {

    const { applicationId } = useParams();

    const [application, setApplication] = useState<any>(null);
    const [actions, setActions] = useState<any[]>([]);

    const [remarks, setRemarks] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        loadApplication();

    }, []);

    const loadApplication = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/workflow/application/" + applicationId,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
console.log(response.data);

            setApplication(response.data.application);
            setActions(response.data.actions);

        }
        catch (err) {

            console.log(err);

        }

    };


    const workflowAction = async (actionId: string) => {

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await axios.post(

                "http://localhost:5000/api/workflow/action",

                {

                    application_id: applicationId,
                    action_id: actionId,
                    remarks: remarks

                },

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );
console.log("Response:", response.data);
            alert(response.data.message);

            loadApplication();

        }
        catch (error: any) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Action failed"
            );

        }
        finally {

            setLoading(false);

        }

    };


    if (!application)
        return <div>Loading...</div>;

    return (

        <div className="application-container">

            <h2>Housing Application</h2>

            <p>
                <b>Name :</b> {application.applicant_name}
            </p>

            <p>
                <b>Mobile :</b> {application.mobile_number}
            </p>

            <p>
                <b>Address :</b> {application.address}
            </p>

            <p>
                <b>Income :</b> {application.annual_income}
            </p>

            <p>
                <b>Income Certificate :</b>

                <a
                    href={`http://localhost:5000/uploads/${application.income_certificate}`}
                    target="_blank"
                    rel="noreferrer"
                >
                    View
                </a>

            </p>

            <p>

                <b>Address Proof :</b>

                <a
                    href={`http://localhost:5000/uploads/${application.address_proof}`}
                    target="_blank"
                    rel="noreferrer"
                >
                    View
                </a>

            </p>

            <textarea

                placeholder="Enter remarks"

                value={remarks}

                onChange={(e) => setRemarks(e.target.value)}

                style={{
                    width: "100%",
                    height: "100px"
                }}

            />

            <br /><br />

          <div style={{ marginTop: "20px" }}>
             
    {actions.map((action: any) => (
        <button
            key={action.action_id}
            disabled={loading}
            style={{ marginRight: "10px" }}
            onClick={() => workflowAction(action.action_id)}
        >
            {action.action_name}
        </button>
    ))}
</div>  

        </div>

    );

}

export default WorkflowApplication;