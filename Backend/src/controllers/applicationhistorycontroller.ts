import { Request, Response } from "express";
import pool from "../db";


export const getApplicationHistory = async (
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

        const result = await pool.query(
            `
            SELECT
                wa.application_id,
                wa.application_no,

                wh.history_id,
                wh.from_state_id,
                fs.state_name AS from_state,

                wh.to_state_id,
                ts.state_name AS to_state,

                wh.action_id,
                act.action_name,

                wh.performed_by,
                u.full_name AS performed_by_name,

                wh.performed_office,
                o.office_name,

                wh.remarks,
                wh.performed_at

            FROM workflow_applications wa

            JOIN workflow_history wh
                ON wa.application_id = wh.application_id

            LEFT JOIN workflow_states fs
                ON wh.from_state_id = fs.state_id

            LEFT JOIN workflow_states ts
                ON wh.to_state_id = ts.state_id

            LEFT JOIN workflow_actions act
                ON wh.action_id = act.action_id

            LEFT JOIN users u
                ON wh.performed_by = u.id

            LEFT JOIN offices o
                ON wh.performed_office = o.office_id

            WHERE wa.application_no = $1

            ORDER BY wh.performed_at ASC
            `,
            [application_no]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Application history not found"
            });

        }

        return res.json({
            application_no,
            history: result.rows
        });

    }
    catch (error) {

        console.error(
            "Application History Error:",
            error
        );

        return res.status(500).json({
            message: "Unable to retrieve application history"
        });

    }

};