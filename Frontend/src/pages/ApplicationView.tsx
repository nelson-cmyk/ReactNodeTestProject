import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/ApplicationView.css";

function ApplicationView() {
    const [actions, setActions] = useState<any[]>([]);
    const { id } = useParams();
    const navigate = useNavigate();

    const [application, setApplication] =
        useState<any>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =========================================
    // Load Application
    // =========================================

    useEffect(() => {

        const loadApplication = async () => {

            try {

                const token =
                    localStorage.getItem("token");

                const response = await axios.get(
    `http://localhost:5000/api/workflow/application/${id}`,
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
);

console.log(
    "Application Response:",
    response.data
);

setApplication(
    response.data.application
);

setActions(
    response.data.actions || []
);

            }
            catch (error: any) {

                console.log(
                    "Application View Error:",
                    error.response?.data ||
                    error.message
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load application"
                );

            }
            finally {

                setLoading(false);

            }

        };


        if (id) {
            loadApplication();
        }

    }, [id]);


    // =========================================
    // Loading
    // =========================================

    if (loading) {

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

    if (error) {

        return (
            <div className="application-container">

                <h2>Application Details</h2>

                <p>{error}</p>

                <button
                    type="button"
                    onClick={() => navigate(-1)}
                >
                    Back
                </button>

            </div>
        );

    }


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


    // =========================================
    // Helper
    // =========================================

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
                                onClick={() => {

                                    console.log(
                                        "Selected Action:",
                                        action
                                    );

                                }}
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