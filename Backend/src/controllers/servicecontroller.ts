import { Request, Response } from "express";
import pool from "../db";

export const getServices = async (
    req: Request,
    res: Response
) => {

    const result = await pool.query(
        `
        SELECT
            service_id,
            service_name,
            workflow_id,
            route,
            description,
            icon
        FROM services
        WHERE is_active = true
        ORDER BY display_order
        `
    );

    res.json(result.rows);

};

export const getDraftApplications = async (
    req: Request,
    res: Response
) => {

    try {

        const workflowId = req.params.workflowId;
        const userId = req.user.id;

        console.log(
            "User ID:",
            userId
        );

        console.log(
            "Workflow ID:",
            workflowId
        );


        const result = await pool.query(
            `
            SELECT
                application_id,
                application_no,
                workflow_id,
                application_status,
                created_at,
                updated_at
            FROM workflow_applications
            WHERE created_by = $1
            AND workflow_id = $2
            AND application_status = 'Draft'
            ORDER BY updated_at DESC
            `,
            [
                userId,
                workflowId
            ]
        );


        console.log(
            "Draft Applications:",
            result.rows
        );


        res.json(
            result.rows
        );

    }
    catch (error) {

        console.log(
            "Draft applications error:",
            error
        );

        res.status(500).json({
            message:
                "Unable to load draft applications"
        });

    }

};

export const getSubmittedApplications = async (
    req: Request,
    res: Response
) => {

    try {

        const workflowId = req.params.workflowId;
        const userId = req.user.id;

        const result = await pool.query(
            `
            SELECT
                wa.application_id,
                wa.application_no,
                wa.application_status,
                ws.state_name,
                wa.updated_at
            FROM workflow_applications wa

            JOIN workflow_states ws
            ON wa.current_state_id = ws.state_id

            WHERE wa.created_by = $1
            AND wa.workflow_id = $2
            AND wa.application_status <> 'Draft'

            ORDER BY wa.updated_at DESC
            `,
            [
                userId,
                workflowId
            ]
        );

        res.json(result.rows);

    }
    catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Unable to load submitted applications"
        });

    }

};