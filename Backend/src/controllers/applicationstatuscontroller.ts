import { Request, Response } from "express";
import pool from "../db";

export const getApplicationStatus = async (
    req: Request,
    res: Response
) => {

    try {

        const { application_no } = req.params;

        if (!application_no) {
            return res.status(400).json({
                message: "Application number is required"
            });
        }
console.log("Application No received:", application_no);
console.log("Application No length:", application_no?.length);
        const result = await pool.query(
            `
            SELECT
                wa.application_id,
                wa.application_no,
                wa.application_status,
                wa.current_state_id,
                ws.state_name,
                wa.created_at,
                wa.updated_at
            FROM workflow_applications wa
            LEFT JOIN workflow_states ws
                ON wa.current_state_id = ws.state_id
            WHERE wa.application_no = $1
            `,
            [application_no]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Application not found"
            });

        }

        const application = result.rows[0];

        return res.json({
            application_no: application.application_no,
            status: application.application_status,
            state_id: application.current_state_id,
            state: application.state_name,
            submitted_on: application.created_at,
            last_updated: application.updated_at
        });

    }
    catch (error) {

        console.error("Application Status Error:", error);

        return res.status(500).json({
            message: "Unable to check application status"
        });

    }

};