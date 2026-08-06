import { useState } from "react";
import BoilerApplicationForm from "./BoilerApplicationForm";
import DraftList from "./DraftList";
import SubmittedList from "./SubmittedList";

function BoilerPage() {

    const [tab, setTab] = useState("new");

    return (
        <div>

            <h2>Boiler Assistance</h2>

            <button onClick={() => setTab("new")}>
                New Application
            </button>

            <button onClick={() => setTab("draft")}>
                Drafts
            </button>

            <button onClick={() => setTab("submitted")}>
                Submitted
            </button>

            <hr />

            {tab === "new" && <BoilerApplicationForm />}

            {tab === "draft" && <DraftList />}

            {tab === "submitted" && <SubmittedList />}

        </div>
    );
}

export default BoilerPage;