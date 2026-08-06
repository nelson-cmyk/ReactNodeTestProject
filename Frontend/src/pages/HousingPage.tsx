import { useState } from "react";
import ApplicationForm from "./ApplicationForm";
import DraftList from "./DraftList";
import SubmittedList from "./SubmittedList";
import "../css/HousingPage.css";

function HousingPage() {

    const [tab, setTab] = useState("new");

    return (
        <div className="housing-container">

            <h2>Housing Assistance</h2>

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

            <div className="tab-content">

                {tab === "new" && <ApplicationForm />}

                {tab === "draft" && <DraftList />}

                {tab === "submitted" && <SubmittedList />}

            </div>

        </div>
    );
}

export default HousingPage;