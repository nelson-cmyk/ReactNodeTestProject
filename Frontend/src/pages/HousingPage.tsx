import { useEffect, useState } from "react";
import axios from "axios";

import ApplicationForm from "./ApplicationForm";
import DraftList from "./DraftList";
import SubmittedList from "./SubmittedList";

import "../css/Service.css";

function HousingPage() {

    const [tab, setTab] = useState("new");
    const [checkingDraft, setCheckingDraft] = useState(true);


    useEffect(() => {

        const checkDraft = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost:5000/api/applications/draft/1",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );


                console.log(
                    "Housing Draft Check:",
                    response.data
                );


                if (response.data.hasDraft === true) {

                    setTab("draft");

                } else {

                    setTab("new");

                }

            }
            catch (error) {

                console.error(
                    "Error checking housing draft:",
                    error
                );

                // Default to New Application
                setTab("new");

            }
            finally {

                setCheckingDraft(false);

            }

        };


        checkDraft();

    }, []);


    /* =========================================
       Loading
       ========================================= */

    if (checkingDraft) {

        return (

            <div className="service-container">

                <h2>Housing Assistance</h2>

                <div className="tab-content">

                    <p>
                        Loading...
                    </p>

                </div>

            </div>

        );

    }


    /* =========================================
       Main Page
       ========================================= */

    return (

        <div className="service-container">

            {/* Page Header */}

            <h2>
                Housing Assistance
            </h2>


            {/* Tabs */}

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


            {/* Tab Content */}

            <div className="tab-content">

                {tab === "new" && (

                    <ApplicationForm />

                )}


                {tab === "draft" && (

                    <DraftList
                        workflowId={1}
                    />

                )}


                {tab === "submitted" && (

                    <SubmittedList
                        workflowId={1}
                    />

                )}

            </div>

        </div>

    );

}

export default HousingPage;