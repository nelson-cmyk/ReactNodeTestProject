

import { Request, Response } from "express";
import pool from "../db";
import {
executeWorkflowAction
}
from "../services/workflowService";

export const performAction = async(
req:Request,
res:Response
)=>{
console.log("performAction called");

console.log("Request body:", req.body);

console.log("User:", req.user);

try{


const {

application_id,

action_id,

remarks

}=req.body;



const result =
await executeWorkflowAction({

applicationId:
application_id,

actionId:
action_id,

userId:
req.user.id,

remarks:
remarks,

ipAddress:
req.ip

});



res.json({

message:
"Workflow action completed",

result

});


}

catch(error:any)
{


console.log(error);


res.status(400).json({

message:error.message

});


}


};











export const getPendingApplications = async (
    req: Request,
    res: Response
) => {
    console.log("Fetching pending applications for user:", req.user.id);
    try {

        const userId = req.user.id;

        const result = await pool.query(
        `
        SELECT
            wt.task_id,
            wt.application_id,
            wa.application_no,
            ah.applicant_name,
            ah.mobile_number,
            ah.house_type,
            wt.assigned_at
        FROM workflow_tasks wt
        JOIN workflow_applications wa
            ON wt.application_id = wa.application_id
        JOIN applications_housing ah
            ON ah.id = wt.application_id
        WHERE wt.assigned_to = $1
        AND wt.task_status = 'Pending'
        ORDER BY wt.assigned_at
        `,
        [userId]);

        res.json(result.rows);

    }
    catch(error){

        console.log(error);

        res.status(500).json({
            message:"Unable to fetch applications"
        });

    }

};



export const getApplicationbyId = async (
    req: Request,
    res: Response
) => {

    try {

        const applicationId = req.params.id;

        const roleId = req.user.role_id;


        // =====================================================
        // 1. Get Common Workflow Application Information
        // =====================================================

        const workflowResult = await pool.query(
            `
            SELECT
                wa.application_id,
                wa.application_no,
                wa.workflow_id,
                wa.created_by,
                wa.office_id,
                wa.current_state_id,
                wa.application_status,
                wa.created_at,
                wa.updated_at
            FROM workflow_applications wa
            WHERE wa.application_id = $1
            `,
            [applicationId]
        );


        if (workflowResult.rows.length === 0) {

            return res.status(404).json({
                message: "Application not found"
            });

        }


        const workflowApplication =
            workflowResult.rows[0];


        console.log(
            "Workflow Application:",
            workflowApplication
        );


        const workflowId =
            workflowApplication.workflow_id;


        // =====================================================
        // 2. Load Service/Application Data
        // =====================================================

        let serviceResult;


        // -----------------------------------------------------
        // Housing
        // -----------------------------------------------------

        if (workflowId === 1) {

            serviceResult = await pool.query(
                `
                SELECT *
                FROM applications_housing
                WHERE id = $1
                `,
                [applicationId]
            );

        }


        // -----------------------------------------------------
        // Boiler
        // -----------------------------------------------------

        else if (workflowId === 2) {

            serviceResult = await pool.query(
                `
                SELECT *
                FROM boiler_applications
                WHERE id = $1
                `,
                [applicationId]
            );

        }


        // -----------------------------------------------------
        // Unknown Workflow
        // -----------------------------------------------------

        else {

            return res.status(400).json({
                message: "Unsupported workflow"
            });

        }


        if (serviceResult.rows.length === 0) {

            return res.status(404).json({
                message: "Application details not found"
            });

        }


        // =====================================================
        // 3. Combine Common + Service Data
        // =====================================================

        const application = {

            ...workflowApplication,

            ...serviceResult.rows[0]

        };


        console.log(
            "Fetched application:",
            application
        );


        // =====================================================
        // 4. Get Available Workflow Actions
        // =====================================================

        const actionResult = await pool.query(
            `
            SELECT
                wa.action_id,
                wa.action_name
            FROM workflow_transitions wt
            JOIN workflow_actions wa
                ON wt.action_id = wa.action_id
            WHERE wt.workflow_id = $1
            AND wt.from_state_id = $2
            AND wt.role_id = $3
            ORDER BY wa.action_name
            `,
            [
                workflowId,
                workflowApplication.current_state_id,
                roleId
            ]
        );


        // =====================================================
        // 5. Response
        // =====================================================

        res.json({

            application,

            actions: actionResult.rows

        });

    }
    catch (error) {

        console.log(
            "Get Application Error:",
            error
        );

        res.status(500).json({

            message:
                "Unable to load application"

        });

    }

};