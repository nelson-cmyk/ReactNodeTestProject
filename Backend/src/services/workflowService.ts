import pool from "../db";


interface WorkflowActionInput {

    applicationId:number;

    actionId:number;

    userId:number;

    remarks:string;

    ipAddress:string | undefined;

}



export const executeWorkflowAction = async(
    data:WorkflowActionInput
)=>{


const client = await pool.connect();


try {


await client.query("BEGIN");



// =====================================================
// 1. Get Current Application State
// =====================================================


const applicationResult = await client.query(
`
SELECT

    workflow_id,
    current_state_id,
    office_id

FROM workflow_applications

WHERE application_id=$1

FOR UPDATE

`,
[
    data.applicationId
]
);



if(applicationResult.rows.length===0)
{

    throw new Error(
        "Application not found"
    );

}



const application =
applicationResult.rows[0];



const workflowId =
application.workflow_id;


const currentStateId =
application.current_state_id;


const officeId =
application.office_id;



// =====================================================
// 2. Find Transition
// =====================================================
console.log("Finding transition for workflowId:", workflowId, "currentStateId:", currentStateId, "actionId:", data.actionId);

const transitionResult =
await client.query(
`
SELECT

    transition_id,
    to_state_id,
    action_id

FROM workflow_transitions

WHERE workflow_id=$1

AND from_state_id=$2

AND action_id=$3

`,
[
    workflowId,
    currentStateId,
    data.actionId
]
);



if(transitionResult.rows.length===0)
{

throw new Error(
"Invalid workflow transition"
);

}



const transition =
transitionResult.rows[0];



const nextStateId =
transition.to_state_id;



// =====================================================
// 3. Find Next Role
// =====================================================
console.log("Finding next role for workflowId:", workflowId, "nextStateId:", nextStateId);

const nextRoleResult =
await client.query(
`
SELECT role_id

FROM workflow_transitions

WHERE workflow_id=$1

AND from_state_id=$2

LIMIT 1

`,
[
    workflowId,
    nextStateId
]
);



if(nextRoleResult.rows.length===0)
{

throw new Error(
"Next role not configured"
);

}


const nextRoleId =
nextRoleResult.rows[0].role_id;

console.log("Finding next role for workflowId:", workflowId, "nextRoleId:", nextRoleId);

// =====================================================
// 4. Find Officer
// =====================================================


const officerResult =
await client.query(
`
SELECT id

FROM users

WHERE office_id=$1

AND role_id=$2

AND is_active=true

LIMIT 1

`,
[
    officeId,
    nextRoleId
]
);



if(officerResult.rows.length===0)
{

throw new Error(
"No officer available"
);

}



const assignedTo =
officerResult.rows[0].id;




// =====================================================
// 5. Complete Current Task
// =====================================================


await client.query(
`
UPDATE workflow_tasks

SET

task_status='Completed',

completed_at=NOW(),

remarks=$1

WHERE application_id=$2

AND task_status='Pending'

`,
[
    data.remarks,
    data.applicationId
]
);



// =====================================================
// 6. Create Next Task
// =====================================================


const taskResult =
await client.query(
`
INSERT INTO workflow_tasks
(
application_id,
state_id,
assigned_to,
assigned_office,
assigned_role_id,
task_status,
assigned_at
)

VALUES
(
$1,$2,$3,$4,$5,'Pending',NOW()
)

RETURNING task_id

`,
[
    data.applicationId,
    nextStateId,
    assignedTo,
    officeId,
    nextRoleId
]
);



const taskId =
taskResult.rows[0].task_id;



// =====================================================
// 7. Update Current State
// =====================================================


await client.query(
`
UPDATE workflow_applications

SET

current_state_id=$1,

updated_at=NOW()

WHERE application_id=$2

`,
[
    nextStateId,
    data.applicationId
]
);

  await client.query(
            `
            UPDATE applications_housing
            SET current_state_id = $1
            WHERE id = $2
            `,
            [
                nextStateId,
                data.applicationId
            ]
        );


// =====================================================
// 8. Insert History
// =====================================================


await client.query(
`
INSERT INTO workflow_history
(
application_id,
task_id,
from_state_id,
to_state_id,
action_id,
performed_office,
performed_by,
remarks,
performed_at,
ip_address
)

VALUES
(
$1,$2,$3,$4,$5,$6,$7,$8,NOW(),$9
)

`,
[
data.applicationId,
taskId,
currentStateId,
nextStateId,
data.actionId,
officeId,
data.userId,
data.remarks,
data.ipAddress
]
);



await client.query("COMMIT");


return {

success:true,

nextStateId

};



}

catch(error)
{

await client.query("ROLLBACK");

throw error;

}

finally
{

client.release();

}


};