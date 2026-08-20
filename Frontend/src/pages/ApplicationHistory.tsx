import { useState } from "react";
import api from "../api/axios";
import "../css/ApplicationHistory.css";

function WorkflowApplicationHistory() {

    const [applicationNo, setApplicationNo] =
        useState("");

    const [history, setHistory] =
        useState<any[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [searched, setSearched] =
        useState(false);


    // =========================================
    // Search Application History
    // =========================================

    const searchHistory = async () => {

        if (!applicationNo.trim()) {

            setError(
                "Please enter application number"
            );

            return;
        }

        setLoading(true);
        setError("");
        setHistory([]);
        setSearched(true);

        try {

            const response = await api.get(
                `/workflow-application-history/${applicationNo.trim()}`
            );

            setHistory(
                response.data.history || []
            );

        }
        catch (error: any) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to retrieve application history"
            );

        }
        finally {

            setLoading(false);

        }

    };


    return (

        <div className="history-container">

            <h2>
                Application Workflow History
            </h2>


            {/* =========================================
                Search
            ========================================= */}

            <div className="history-search">

                <input
                    type="text"
                    value={applicationNo}
                    placeholder="Enter Application Number"
                    onChange={(e) =>
                        setApplicationNo(
                            e.target.value
                        )
                    }
                    onKeyDown={(e) => {

                        if (e.key === "Enter") {
                            searchHistory();
                        }

                    }}
                />

                <button
                    type="button"
                    onClick={searchHistory}
                    disabled={loading}
                >
                    {loading
                        ? "Searching..."
                        : "View History"
                    }
                </button>

            </div>


            {/* =========================================
                Error
            ========================================= */}

            {error && (

                <div className="history-error">

                    {error}

                </div>

            )}


            {/* =========================================
                History
            ========================================= */}

            {history.length > 0 && (

                <div className="history-result">

                    <h3>
                        Application:
                        {" "}
                        {applicationNo}
                    </h3>


                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Date & Time
                                </th>

                                <th>
                                    From
                                </th>

                                <th>
                                    Action
                                </th>

                                <th>
                                    To
                                </th>

                                <th>
                                    Performed By
                                </th>

                                <th>
                                    Office
                                </th>

                                <th>
                                    Remarks
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {history.map(
                                (item) => (

                                    <tr
                                        key={
                                            item.history_id
                                        }
                                    >

                                        <td>
                                            {item.performed_at
                                                ? new Date(
                                                    item.performed_at
                                                ).toLocaleString()
                                                : "-"
                                            }
                                        </td>


                                        <td>
                                            {item.from_state ||
                                                "-"
                                            }
                                        </td>


                                        <td>
                                            {item.action_name ||
                                                "-"
                                            }
                                        </td>


                                        <td>
                                            {item.to_state ||
                                                "-"
                                            }
                                        </td>


                                        <td>
                                            {item.performed_by_name ||
                                                "-"
                                            }
                                        </td>


                                        <td>
                                            {item.office_name ||
                                                "-"
                                            }
                                        </td>


                                        <td>
                                            {item.remarks ||
                                                "-"
                                            }
                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>

            )}


            {/* =========================================
                No History
            ========================================= */}

            {searched &&
                !loading &&
                !error &&
                history.length === 0 && (

                    <div className="no-history">

                        No workflow history found.

                    </div>

                )}

        </div>

    );

}

export default WorkflowApplicationHistory;