

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



export const getApplication = async(

    req:Request,
    res:Response

)=>{

    try{

        const applicationId=req.params.id;
        const roleId = req.user.role_id;
        const result=await pool.query(

        `
        SELECT

    wa.application_no,
    wa.workflow_id,
    wa.current_state_id,
    ah.*

FROM workflow_applications wa
JOIN applications_housing ah
ON wa.application_id = ah.id

WHERE wa.application_id = $1

        `,

        [applicationId]

        );

        if(result.rows.length===0){

            return res.status(404).json({

                message:"Application not found"

            });

        }
        const application = result.rows[0];
console.log("Fetched application:", application.workflow_id, application.current_state_id);

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
    application.workflow_id,
    application.current_state_id,
    roleId
]
);
        res.json({

    application,

    actions: actionResult.rows

});

    }

    catch(error){

        console.log(error);

        res.status(500).json({

            message:"Unable to load application"

        });

    }

};