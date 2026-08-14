import { useEffect, useState } from "react";
import axios from "axios";
import "../css/Dashboard.css";
import { useQueryClient } from "@tanstack/react-query";

function Dashboard() {
     console.log("1. DASHBOARD LOADED");
const [stats,setStats] = useState({

    total:0,
    approved:0,
    pending:0,
    completed:0

});
     const queryClient = useQueryClient();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {

        const prefetchApplicantApplications = async () => {

            const token =
                localStorage.getItem("token");

            const userString =
                localStorage.getItem("user");

            if (!token || !userString) {
                return;
            }

            const user =
                JSON.parse(userString);

            // Applicant only
            if (Number(user.role_id) !== 4) {
                return;
            }

            console.log(
                "Prefetching applicant applications..."
            );

            await queryClient.prefetchQuery({

                queryKey: [
                    "applicant-applications",
                    user.id
                ],

                queryFn: async () => {

                    const response =
                        await axios.get(
                            "http://localhost:5000/api/applications/my-applications",
                            {
                                headers: {
                                    Authorization:
                                        `Bearer ${token}`
                                }
                            }
                        );

                    console.log(
                        "Applicant applications prefetched:",
                        response.data
                    );

                    return response.data;
                },

                staleTime: 30 * 1000,

                gcTime: 5 * 60 * 1000

            });

        };

        prefetchApplicantApplications();

    }, [queryClient]);


    return (
        <div>
            <h2>Dashboard</h2>

            <div className="dashboard">

            <div className="dashboard-header">
                <h2>Welcome {user.username}</h2>
                <p> Dashboard</p>
            </div>

            <div className="dashboard-cards">

                <div className="dashboard-card">
                    <h3>Total Applications</h3>
                    <h1>{stats.total}</h1>
                    <span>Applications Received</span>
                </div>

                <div className="dashboard-card">
                    <h3>Approved</h3>
                    <h1>{stats.approved}</h1>
                    <span>Approved Cases</span>
                </div>

                <div className="dashboard-card">
                    <h3>Pending</h3>
                    <h1>{stats.pending}</h1>
                    <span>Awaiting Approval</span>
                </div>

                <div className="dashboard-card">
                    <h3>Completed</h3>
                    <h1>{stats.completed}</h1>
                    <span>Completed Cases</span>
                </div>

            </div>

            <div className="dashboard-actions">

                <h3>Quick Actions</h3>

                <div className="action-grid">

                    <button className="action-btn">Apply Service</button>
                    <button className="action-btn">View Reports</button>
                    <button className="action-btn">Create Staff</button>
                    <button className="action-btn">User Management</button>

                </div>

            </div>

            <div className="dashboard-user">

                <h3>User Information</h3>

                <table>

                    <tbody>

                        <tr>
                            <td>Name</td>
                            <td>{user.username}</td>
                        </tr>

                        <tr>
                            <td>Email</td>
                            <td>{user.email}</td>
                        </tr>

                        <tr>
                            <td>Role ID</td>
                            <td>{user.role_id}</td>
                        </tr>

                    </tbody>

                </table>

            </div>

        </div>

        </div>
    );
}

export default Dashboard;


        

