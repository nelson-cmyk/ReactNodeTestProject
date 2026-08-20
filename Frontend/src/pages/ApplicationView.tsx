import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../css/ApplicationView.css";

  interface WorkflowAction {
    action_id: number;
    action_name: string;
}

function ApplicationView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
  

const [remarks, setRemarks] = useState("");
    // =========================================
    // Load Application
    // =========================================
const fetchApplication = async () => {

    const response = await api.get(
        `/workflow/application/${id}`
    );

    console.log(
        "Application Response:",
        response.data
    );

    return response.data;
};
   
const {
    data,
    isLoading,
    isError,
    error,
    refetch
} = useQuery({

    queryKey: [
        "applicant-applications",
        id
    ],

    queryFn: fetchApplication,

    enabled: !!id,

});


    // =====================================================
    // Data
    // =====================================================

    const application =
        data?.application || null;

    const actions: WorkflowAction[] = data?.actions || [];

    // =========================================
    // Loading
    // =========================================

    if (isLoading) {
        return (
            <div className="application-container">
                <h2>Application Details</h2>
                <p>Loading application...</p>
            </div>
        );
    }

    // =========================================
    // Error
    // =========================================

    if (isError) {

    console.error(
        "Application View Error:",
        error
    );

    return (
        <div className="application-container">

            <h2>
                Application Details
            </h2>

            <p>
                Unable to load application.
            </p>

            <button
                type="button"
                onClick={() => refetch()}
            >
                Retry
            </button>

            <button
                type="button"
                onClick={() => navigate(-1)}
            >
                Back
            </button>

        </div>
    );
}
// =====================================================
    // No Application
    // =====================================================

    if (!application) {

        return (
            <div className="application-container">

                <h2>Application Details</h2>

                <p>Application not found.</p>

                <button
                    type="button"
                    onClick={() => navigate(-1)}
                >
                    Back
                </button>

            </div>
        );

    }


    // =====================================================
    // Date Formatter
    // =====================================================
    const formatDate = (date: string) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    };


    // =====================================================
    // Workflow Action
    // =====================================================

const handleAction = async (action: WorkflowAction) => {

    try {

        if (
            (action.action_name === "Reject" ||
             action.action_name === "Cancel") &&
            !remarks.trim()
        ) {
            alert("Remarks are required.");
            return;
        }

        const response = await api.post(
            "/workflow/action",
            {
                application_id:
                    application.application_id,

                action_id:
                    action.action_id,

                remarks:
                    remarks.trim()
            }
        );

        console.log(
            "Workflow Action Response:",
            response.data
        );

        alert(response.data.message);

        // Remove old cached application
        queryClient.invalidateQueries({
            queryKey: [
                "applicant-applications",
                id
            ]
        });

        // Also invalidate lists
        queryClient.invalidateQueries({
            queryKey: ["drafts"]
        });

        queryClient.invalidateQueries({
            queryKey: ["submitted"]
        });

        navigate(-1);

    } catch (error: any) {

        console.log(
            "Workflow Action Error:",
            error.response?.data ||
            error.message
        );

        alert(
            error.response?.data?.message ||
            "Unable to perform action"
        );
    }
};
    return (

        <div className="application-container">

            {/* =====================================
                Header
            ===================================== */}

            <div className="application-view-header">

                <div>

                    <h2>
                        Application Details
                    </h2>

                    <p>
                        View submitted application
                        information
                    </p>

                </div>


                <div className="application-number">

                    <span>
                        Application No.
                    </span>

                    <strong>
                        {application.application_no || "-"}
                    </strong>

                </div>

            </div>


            {/* =====================================
                Application Status
            ===================================== */}

            <div className="application-status-card">

                <div>

                    <span className="status-label">
                        Application Status
                    </span>

                    <strong>
                        {application.application_status || "-"}
                    </strong>

                </div>


                <div>

                    <span className="status-label">
                        Current State
                    </span>

                    <strong>
                        {application.current_state_name || "-"}
                    </strong>

                </div>


                <div>

                    <span className="status-label">
                        Submitted On
                    </span>

                    <strong>
                        {formatDate(
                            application.created_at
                        )}
                    </strong>

                </div>

            </div>


            {/* =====================================
                Applicant Information
            ===================================== */}

            <div className="application-section">

                <div className="application-section-title">

                    <h3>
                        Applicant Information
                    </h3>

                </div>


                <div className="application-view-grid">


                    <div className="application-field">

                        <label>
                            Applicant Name
                        </label>

                        <div className="field-value">
                            {application.applicant_name || "-"}
                        </div>

                    </div>


                    <div className="application-field">

                        <label>
                            Mobile Number
                        </label>

                        <div className="field-value">
                            {application.mobile_number || "-"}
                        </div>

                    </div>


                    <div className="application-field full-width">

                        <label>
                            Address
                        </label>

                        <div className="field-value field-value-large">
                            {application.address || "-"}
                        </div>

                    </div>


                </div>

            </div>


            {/* =====================================
                Housing Details
            ===================================== */}

            {application.workflow_id === 1 && (

                <div className="application-section">

                    <div className="application-section-title">

                        <h3>
                            Housing Details
                        </h3>

                    </div>


                    <div className="application-view-grid">


                        <div className="application-field">

                            <label>
                                House Type
                            </label>

                            <div className="field-value">
                                {application.house_type || "-"}
                            </div>

                        </div>


                        <div className="application-field">

                            <label>
                                Annual Income
                            </label>

                            <div className="field-value">
                                {application.annual_income || "-"}
                            </div>

                        </div>


                    </div>


                    {/* Documents */}

                    <div className="documents-section">

                        <h4>
                            Uploaded Documents
                        </h4>


                        <div className="document-list">


                            {application.income_certificate && (

                                <div className="document-item">

                                    <div>

                                        <span className="document-title">
                                            Income Certificate
                                        </span>

                                        <span className="document-name">
                                            {
                                                application.income_certificate
                                            }
                                        </span>

                                    </div>


                                    <a
                                        href={
                                            `http://localhost:5000/uploads/${application.income_certificate}`
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                        className="document-button"
                                    >
                                        View
                                    </a>

                                </div>

                            )}


                            {application.address_proof && (

                                <div className="document-item">

                                    <div>

                                        <span className="document-title">
                                            Address Proof
                                        </span>

                                        <span className="document-name">
                                            {
                                                application.address_proof
                                            }
                                        </span>

                                    </div>


                                    <a
                                        href={
                                            `http://localhost:5000/uploads/${application.address_proof}`
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                        className="document-button"
                                    >
                                        View
                                    </a>

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            )}


            {/* =====================================
                Boiler Details
            ===================================== */}

            {application.workflow_id === 2 && (

                <div className="application-section">

                    <div className="application-section-title">

                        <h3>
                            Boiler Details
                        </h3>

                    </div>


                    <div className="application-view-grid">


                        <div className="application-field">

                            <label>
                                Boiler Type
                            </label>

                            <div className="field-value">
                                {application.boiler_type || "-"}
                            </div>

                        </div>


                        <div className="application-field">

                            <label>
                                Boiler Capacity
                            </label>

                            <div className="field-value">

                                {application.boiler_capacity
                                    ? `${application.boiler_capacity} TPH`
                                    : "-"
                                }

                            </div>

                        </div>


                        <div className="application-field">

                            <label>
                                Year of Installation
                            </label>

                            <div className="field-value">
                                {
                                    application.year_of_installation ||
                                    "-"
                                }
                            </div>

                        </div>


                        <div className="application-field full-width">

                            <label>
                                Purpose
                            </label>

                            <div className="field-value field-value-large">
                                {application.purpose || "-"}
                            </div>

                        </div>


                    </div>


                    {/* =================================
                        Boiler Certificate
                    ================================= */}

                    {application.boiler_certificate && (

                        <div className="documents-section">

                            <h4>
                                Uploaded Documents
                            </h4>


                            <div className="document-list">


                                <div className="document-item">

                                    <div>

                                        <span className="document-title">
                                            Boiler Certificate
                                        </span>

                                        <span className="document-name">

                                            {
                                                application.boiler_certificate
                                            }

                                        </span>

                                    </div>


                                    <a
                                        href={
                                            `http://localhost:5000/uploads/${application.boiler_certificate}`
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                        className="document-button"
                                    >
                                        View
                                    </a>

                                </div>


                            </div>

                        </div>

                    )}

                </div>

            )}


            {/* =====================================
                Workflow Information
            ===================================== */}

            <div className="application-section">

                <div className="application-section-title">

                    <h3>
                        Application Information
                    </h3>

                </div>


                <div className="application-view-grid">


                    <div className="application-field">

                        <label>
                            Application Status
                        </label>

                        <div className="field-value">
                            {
                                application.application_status ||
                                "-"
                            }
                        </div>

                    </div>


                    <div className="application-field">

                        <label>
                            Current State
                        </label>

                        <div className="field-value">
                            {
                                application.current_state_name ||
                                "-"
                            }
                        </div>

                    </div>


                    <div className="application-field">

                        <label>
                            Submitted On
                        </label>

                        <div className="field-value">
                            {
                                formatDate(
                                    application.created_at
                                )
                            }
                        </div>

                    </div>


                    <div className="application-field">

                        <label>
                            Last Updated
                        </label>

                        <div className="field-value">
                            {
                                formatDate(
                                    application.updated_at
                                )
                            }
                        </div>

                    </div>


                </div>

            </div>

<textarea
    value={remarks}
    onChange={(e) => setRemarks(e.target.value)}
    placeholder="Enter remarks"
    className="remarks-input"
/>
             {/* =========================================
            Footer / Workflow Actions
        ========================================= */}

        <div className="application-view-footer">

            {/* =========================================
                Workflow Actions
            ========================================= */}

            {actions.length > 0 && (

                <div className="workflow-actions">

                    <h3>
                        Actions
                    </h3>

                    <div className="action-buttons">

                         {actions.map((action) => (

        <button
            key={action.action_id}
            type="button"
            className="table-action"
            onClick={() => handleAction(action)}
        >
            {action.action_name}
        </button>

    ))}


                    </div>

                </div>

            )}


            {/* =========================================
                Back Button
            ========================================= */}

            <button
                type="button"
                className="back-button"
                onClick={() => navigate(-1)}
            >
                Back
            </button>

        </div>

    </div>

);

}

export default ApplicationView;