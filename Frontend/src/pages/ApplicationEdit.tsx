import { useParams } from "react-router-dom";

import ApplicationForm from "./ApplicationForm";
import BoilerApplicationForm from "./BoilerApplicationForm";

function ApplicationEdit() {

    const {
        workflowId,
        applicationId
    } = useParams();


    console.log(
        "Workflow ID:",
        workflowId
    );

    console.log(
        "Application ID:",
        applicationId
    );


    if (!applicationId) {

        return (
            <div>
                Invalid application ID
            </div>
        );

    }


    if (workflowId === "1") {

        return (
            <ApplicationForm
                applicationId={applicationId}
            />
        );

    }


    if (workflowId === "2") {

        return (
            <BoilerApplicationForm
                applicationId={applicationId}
            />
        );

    }


    return (
        <div>
            Invalid workflow
        </div>
    );

}

export default ApplicationEdit;