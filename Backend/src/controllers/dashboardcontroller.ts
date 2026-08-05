import { Request, Response } from "express";
import pool from "../db";

export const getDashboardStats = async (
    req: Request,
    res: Response
) => {

    try {

        const userId = req.user.id;
        const roleId = req.user.role_id;

        let pendingQuery;

        // Applicant
        if (roleId === 4) {

            pendingQuery = await pool.query(
                `
                SELECT COUNT(*) AS pending
                FROM workflow_applications
                WHERE created_by = $1
                AND application_status = 'Submitted'
                `,
                [userId]
            );
const pendingCount = Number(
    pendingQuery.rows[0].pending
);

console.log("Pending Count:", pendingCount);
        } else {

            // Officers
            pendingQuery = await pool.query(
                `
                SELECT COUNT(*) AS pending
                FROM workflow_tasks
                WHERE assigned_to = $1
                AND task_status = 'Pending'
                `,
                [userId]
            );

        }

       const totalApplications = await pool.query(
`
SELECT COUNT(DISTINCT application_id) AS total
FROM workflow_tasks
WHERE assigned_to = $1
`,
[userId]
);

        const approvedApplications = await pool.query(
            `
           SELECT COUNT(*) AS completed
            FROM workflow_tasks
            WHERE task_status='Completed'
            AND assigned_to = $1
            `,
                [userId]
            
        );

        const totalCompleted = await pool.query(
            `
            SELECT COUNT(*) AS completed
            FROM workflow_tasks
            WHERE task_status='Completed'
            `
        );
            

        res.json({

            total:
                Number(totalApplications.rows[0].total),

            approved:
                Number(approvedApplications.rows[0].approved),

            pending:
                Number(pendingQuery.rows[0].pending),

            completed:
                Number(totalCompleted.rows[0].users)

        });

    }
    catch(error:any){

        console.log(error);

        res.status(500).json({
            message:error.message
        });

    }

};