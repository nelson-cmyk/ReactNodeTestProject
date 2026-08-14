import { useState } from "react";
import axios from "axios";
import "../css/ApplicationStatus.css";

function ApplicationStatus() {

    const [applicationNo, setApplicationNo] = useState("");
    const [application, setApplication] = useState<any>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const checkStatus = async () => {

        if (!applicationNo.trim()) {
            setError("Please enter application number");
            return;
        }

        setLoading(true);
        setError("");
        setApplication(null);
        const token =
            localStorage.getItem("token");

        try {

            const response = await axios.get(
                `http://localhost:5000/api/application-status/${applicationNo.trim()}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setApplication(response.data);

        }
        catch (error: any) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to check application status"
            );

        }
        finally {

            setLoading(false);

        }

    };

    return (
        <div className="application-status-container">

            <h2>
                Check Application Status
            </h2>

            <div className="status-search">

                <input
                    type="text"
                    placeholder="Enter Application Number"
                    value={applicationNo}
                    onChange={(e) =>
                        setApplicationNo(e.target.value)
                    }
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            checkStatus();
                        }
                    }}
                />

                <button
                    type="button"
                    onClick={checkStatus}
                    disabled={loading}
                >
                    {loading
                        ? "Checking..."
                        : "Check Status"
                    }
                </button>

            </div>

            {error && (
                <div className="status-error">
                    {error}
                </div>
            )}

            {application && (

                <div className="status-result">

                    <h3>
                        Application Details
                    </h3>

                    <div className="status-row">
                        <strong>
                            Application Number
                        </strong>

                        <span>
                            {application.application_no}
                        </span>
                    </div>

                    <div className="status-row">
                        <strong>
                            Status
                        </strong>

                        <span>
                            {application.status}
                        </span>
                    </div>

                    <div className="status-row">
                        <strong>
                            Current Stage
                        </strong>

                        <span>
                            {application.state}
                        </span>
                    </div>

                    <div className="status-row">
                        <strong>
                            Submitted On
                        </strong>

                        <span>
                            {application.submitted_on
                                ? new Date(
                                    application.submitted_on
                                ).toLocaleString()
                                : "-"
                            }
                        </span>
                    </div>

                    <div className="status-row">
                        <strong>
                            Last Updated
                        </strong>

                        <span>
                            {application.last_updated
                                ? new Date(
                                    application.last_updated
                                ).toLocaleString()
                                : "-"
                            }
                        </span>
                    </div>

                </div>

            )}

        </div>
    );
}

export default ApplicationStatus;