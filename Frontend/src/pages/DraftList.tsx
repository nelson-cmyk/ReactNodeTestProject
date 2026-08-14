import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
    useQuery
} from "@tanstack/react-query";
import "../css/Tables.css";

interface Props {
    workflowId?: number;
}

function DraftList({ workflowId }: Props) {



    const loadDrafts = async () => {
            
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

            return response.data;

        }; 

const {
    data: drafts = [],
    isLoading,
    isError,
    refetch
} = useQuery({

    queryKey: [
        "drafts",
        workflowId
    ],

    queryFn: loadDrafts,

});

    if (isLoading) {

        return (
            <div>
                Loading drafts...
            </div>
        );

    }
// =========================================
    // Error
    // =========================================

    if (isError) {

        console.error(
            "Draft loading error:",
            isError
        );

        return (
            <div className="application-container">

                <p>
                    Unable to load drafts.
                </p>

                <button
                    type="button"
                    onClick={() => refetch()}
                >
                    Retry
                </button>

            </div>
        );

    }
   // =========================================
    // No Drafts
    // =========================================

    if (drafts.length === 0) {

        return (
            <div className="application-container">

                <p>
                    No draft applications found.
                </p>

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