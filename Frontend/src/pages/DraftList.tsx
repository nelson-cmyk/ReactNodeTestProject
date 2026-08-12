import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import "../css/Tables.css";

interface Props {
    workflowId?: number;
}

function DraftList({ workflowId }: Props) {

    const [drafts, setDrafts] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);


    useEffect(() => {

        loadDrafts();

    }, [workflowId]);


    const loadDrafts = async () => {

        try {
            
            const token = localStorage.getItem("token");

            const response = await axios.get(
                `http://localhost:5000/api/applications/drafts/${workflowId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("Draft API Response:", response.data);

            setDrafts(response.data);

        } catch (error) {

            console.error("Error loading drafts:", error);

        } finally {

            setLoading(false);

        }

    };


    if (loading) {

        return (
            <div>
                Loading drafts...
            </div>
        );

    }


    if (drafts.length === 0) {

        return (
            <div className="empty-state">
                <h4>No Draft Applications</h4>
                <p>You currently have no saved draft applications.</p>
            </div>
        );

    }


    return (

        <div className="common-table-wrapper">

            <table className="common-table">

                <thead>

                    <tr>
                        <th>Application No</th>
                        <th>Last Saved</th>
                        <th>Action</th>
                    </tr>

                </thead>


                <tbody>

                    {drafts.map((draft: any) => (

                        <tr key={draft.application_id}>

                            <td className="application-number">
                                {draft.application_no}
                            </td>

                            <td>
                                {draft.updated_at}
                            </td>

                            <td>

                                <Link
    className="table-action"
    to={`/applications/${workflowId}/edit/${draft.application_id}`}
>
    Continue
</Link>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

export default DraftList;