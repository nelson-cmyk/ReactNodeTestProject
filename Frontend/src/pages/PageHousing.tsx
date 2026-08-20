import { useEffect, useState } from "react";
import api from "../api/axios";

import ApplicationForm from "./ApplicationFormHousing";
import DraftList from "./DraftList";
import SubmittedList from "./SubmittedList";

import "../css/Service.css";

function HousingPage() {

    const workflowId = 1;

    const [tab, setTab] = useState("new");

    const [drafts, setDrafts] = useState<any[]>([]);

    const [checkingDraft, setCheckingDraft] = useState(true);


    useEffect(() => {

        checkDrafts();

    }, []);


    const checkDrafts = async () => {

        try {

            const response = await api.get(
                `/applications/drafts/${workflowId}`
            );

            const draftData =
                Array.isArray(response.data)
                    ? response.data
                    : [];


            console.log(
                "Housing Drafts:",
                draftData
            );


            setDrafts(draftData);


            /*
             * Draft exists
             */

            if (draftData.length > 0) {

                setTab("draft");

            }

            /*
             * No draft
             */

            else {

                setTab("new");

            }

        }
        catch (error) {

            console.error(
                "Error checking drafts:",
                error
            );

            setDrafts([]);

            setTab("new");

        }
        finally {

            setCheckingDraft(false);

        }

    };


    if (checkingDraft) {

        return (

            <div className="service-container">

                <h2>
                    Housing Assistance
                </h2>

                <div className="tab-content">

                    Loading...

                </div>

            </div>

        );

    }


    return (

        <div className="service-container">

            <h2>
                Housing Assistance
            </h2>


            <div className="tabs">

                <button
                    className={
                        tab === "new"
                            ? "active"
                            : ""
                    }

                    onClick={() =>
                        setTab("new")
                    }
                >
                    New Application
                </button>


                <button
                    className={
                        tab === "draft"
                            ? "active"
                            : ""
                    }

                    onClick={() =>
                        setTab("draft")
                    }
                >
                    Drafts
                </button>


                <button
                    className={
                        tab === "submitted"
                            ? "active"
                            : ""
                    }

                    onClick={() =>
                        setTab("submitted")
                    }
                >
                    Submitted
                </button>

            </div>


            <div className="tab-content">

                {tab === "new" && (

                    <ApplicationForm />

                )}


                {tab === "draft" && (

                    <DraftList
                        workflowId={workflowId}
                        drafts={drafts}
                    />

                )}


                {tab === "submitted" && (

                    <SubmittedList
                        workflowId={workflowId}
                    />

                )}

            </div>

        </div>

    );

}

export default HousingPage;