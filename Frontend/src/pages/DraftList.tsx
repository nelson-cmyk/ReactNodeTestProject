import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Props {
    workflowId?: number;
}

function DraftList({ workflowId = 1 }: Props) {

    const [drafts, setDrafts] = useState<any[]>([]);

    useEffect(() => {
        loadDrafts();
    }, []);

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

        }
        catch (error) {

            console.log(error);

        }

    };

    if (drafts.length === 0) {

        return <h4>No Draft Applications</h4>;

    }

    return (

        <table className="table">

            <thead>

                <tr>

                    <th>Application No</th>
                    <th>Last Saved</th>
                    <th>Action</th>

                </tr>

            </thead>

            <tbody>

                {

                    drafts.map((draft: any) => (

                        <tr key={draft.application_id}>

                            <td>{draft.application_no}</td>

                            <td>{draft.updated_at}</td>

                            <td>

                                <Link
                                    to={`/application/edit/${draft.application_id}`}
                                >
                                    Continue
                                </Link>

                            </td>

                        </tr>

                    ))

                }

            </tbody>

        </table>

    );

}

export default DraftList;