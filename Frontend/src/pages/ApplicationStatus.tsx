import { useState } from "react";
import api from "../api/axios";
import "../css/ApplicationStatus.css";
import { useQueryClient } from "@tanstack/react-query";


function ApplicationStatus() {
    const queryClient = useQueryClient();
    const [applicationNo, setApplicationNo] = useState("");
    const [application, setApplication] = useState<any>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const checkStatus = async () => {

    const searchNo = applicationNo.trim();

    if (!searchNo) {
        setError("Please enter application number");
        return;
    }



    
    setLoading(true);
    setError("");
    setApplication(null);

    try {

        const userString =
            localStorage.getItem("user");

        const user =
            userString
                ? JSON.parse(userString)
                : null;


        // =====================================================
        // APPLICANT
        // Use prefetched React Query cache
        // =====================================================
console.log("User role:", user?.role_id);
        if (user?.role_id === 4) {

            const cachedApplications =
                queryClient.getQueryData<any[]>(
                    ["applicant-applications", user.id]
                );

            console.log(
                "Applicant cache:",
                cachedApplications
            );


            if (cachedApplications) {

                const cachedApplication =
                    cachedApplications.find(
                        (app) =>
                            app.application_no ===
                            searchNo
                    );


                if (cachedApplication) {

                    console.log(
                        "Application found in CACHE"
                    );

                    setApplication(
                        cachedApplication
                    );

                    setLoading(false);

                    return;
                }


                // Cache exists but application wasn't found
                console.log(
                    "Application not found in CACHE"
                );

                setError(
                    "Application not found"
                );

                setLoading(false);

                return;
            }


            // =================================================
            // Cache does not exist
            // Fallback to API
            // =================================================

            console.log(
                "Applicant cache does not exist. Calling API..."
            );

        }


        // =====================================================
        // VERIFIER / OTHER ROLES
        // Always query API
        // =====================================================

        console.log(
            "Fetching application from API..."
        );


        const response = await api.get(
    `/application-status/${searchNo}`
);


        console.log(
            "Application fetched from API:",
            response.data
        );


        setApplication(
            response.data
        );

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