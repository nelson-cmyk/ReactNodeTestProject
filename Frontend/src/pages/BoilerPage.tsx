import { useState } from "react";

import BoilerApplicationForm from "./BoilerApplicationForm";
import DraftList from "./DraftList";
import SubmittedList from "./SubmittedList";

import "../css/Service.css";

function BoilerPage() {

    const [tab, setTab] = useState("new");

    return (

        <div className="service-container">

            {/* =========================================
                Page Header
                ========================================= */}

            <h2>Boiler Assistance</h2>


            {/* =========================================
                Tabs
                ========================================= */}

            <div className="tabs">

                <button
                    className={tab === "new" ? "active" : ""}
                    onClick={() => setTab("new")}
                >
                    New Application
                </button>


                <button
                    className={tab === "draft" ? "active" : ""}
                    onClick={() => setTab("draft")}
                >
                    Drafts
                </button>


                <button
                    className={tab === "submitted" ? "active" : ""}
                    onClick={() => setTab("submitted")}
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
                    <DraftList workflowId={2} />
                )}


                {tab === "submitted" && (
                    <SubmittedList workflowId={2} />
                )}

            </div>

        </div>

    );

}

export default BoilerPage;