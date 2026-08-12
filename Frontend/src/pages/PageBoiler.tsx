import { useEffect, useState } from "react";
import axios from "axios";

import BoilerApplicationForm from "./ApplicationFormBoiler";
import DraftList from "./DraftList";
import SubmittedList from "./SubmittedList";

import "../css/Service.css";

function BoilerPage() {

    const workflowId = 2;

    const [tab, setTab] = useState("new");

    const [drafts, setDrafts] = useState<any[]>([]);

    const [checkingDraft, setCheckingDraft] = useState(true);


    /* =========================================
       Check Applicant's Drafts
       ========================================= */

    useEffect(() => {

        checkDrafts();

    }, []);


    const checkDrafts = async () => {

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


            console.log(
                "Boiler Drafts:",
                response.data
            );


            const draftData =
                Array.isArray(response.data)
                    ? response.data
                    : [];


            /*
             * Store drafts
             */

            setDrafts(draftData);


            /*
             * Automatically open Drafts
             * if applicant has a draft.
             */

            if (draftData.length > 0) {

                setTab("draft");

            }
            else {

                setTab("new");

            }

        }
        catch (error) {

            console.error(
                "Error checking boiler drafts:",
                error
            );

            /*
             * If API fails,
             * open New Application.
             */

            setDrafts([]);

            setTab("new");

        }
        finally {

            setCheckingDraft(false);

        }

    };


    /* =========================================
       Loading
       ========================================= */

    if (checkingDraft) {

        return (

            <div className="service-container">

                <h2>
                    Boiler Assistance
                </h2>

                <div className="tab-content">

                    Loading...

                </div>

            </div>

        );

    }


    /* =========================================
       Main Page
       ========================================= */

    return (

        <div className="service-container">

            {/* =========================================
                Page Header
                ========================================= */}

            <h2>
                Boiler Assistance
            </h2>


            {/* =========================================
                Tabs
                ========================================= */}

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


            {/* =========================================
                Tab Content
                ========================================= */}

            <div className="tab-content">

                {tab === "new" && (

                    <BoilerApplicationForm />

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

export default BoilerPage;