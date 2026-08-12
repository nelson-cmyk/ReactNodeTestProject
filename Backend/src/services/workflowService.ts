import pool from "../db";


interface WorkflowActionInput {

    applicationId:number;

    actionId:number;

    userId:number;

    remarks:string;

    ipAddress:string | undefined;

}



export const executeWorkflowAction = async ({
    applicationId,
    actionId,
    userId,
    remarks,
    ipAddress
}: {
    applicationId: number;
    actionId: number;
    userId: number;
    remarks?: string;
    ipAddress?: string;
}) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        // =====================================================
        // 1. Get Application
        // =====================================================

        const applicationResult = await client.query(
            `
            SELECT
                wa.application_id,
                wa.workflow_id,
                wa.application_no,
                wa.current_state_id,
                wa.application_status,
                wa.office_id
            FROM workflow_applications wa
            WHERE wa.application_id = $1
            FOR UPDATE
            `,
            [applicationId]
        );

        if (applicationResult.rows.length === 0) {
            throw new Error("Application not found");
        }

        const application =
            applicationResult.rows[0];


        const workflowId =
            application.workflow_id;

        const currentStateId =
            application.current_state_id;

        const assignedOffice =
            application.office_id;


        // =====================================================
        // 2. Verify Current User Has This Task
        // =====================================================

        const taskResult = await client.query(
            `
            SELECT
                task_id,
                assigned_role_id
            FROM workflow_tasks
            WHERE application_id = $1
            AND assigned_to = $2
            AND task_status = 'Pending'
            ORDER BY assigned_at DESC
            LIMIT 1
            `,
            [
                applicationId,
                userId
            ]
        );

        if (taskResult.rows.length === 0) {
            throw new Error(
                "You are not authorized to perform this action"
            );
        }

        const currentTask =
            taskResult.rows[0];


        // =====================================================
        // 3. Get Transition
        // =====================================================

       const transitionResult = await client.query(
    `
    SELECT
        wt.action_id,
        wt.from_state_id,
        wt.to_state_id,
        wt.role_id,
        wt.next_role_id,
        wa.action_name
    FROM workflow_transitions wt

    JOIN workflow_actions wa
        ON wt.action_id = wa.action_id

    WHERE wt.workflow_id = $1
    AND wt.from_state_id = $2
    AND wt.action_id = $3
    `,
    [
        workflowId,
        currentStateId,
        actionId
    ]
);

const transition =
    transitionResult.rows[0];

const actionName =
    transition.action_name;

const nextStateId =
    transition.to_state_id;

const nextRoleId =
    transition.next_role_id;

console.log("Action:", actionName);
console.log("Current State:", currentStateId);
console.log("Next State:", nextStateId);
console.log("Next Role:", nextRoleId);
        // =====================================================
        // 4. Complete Current Task
        // =====================================================

        await client.query(
            `
            UPDATE workflow_tasks
            SET
                task_status = 'Completed',
                completed_at = NOW()
            WHERE task_id = $1
            `,
            [
                currentTask.task_id
            ]
        );


        // =====================================================
        // 5. Update Application State
        // =====================================================

        let applicationStatus = "In Progress";

        if (actionName === "Reject") {
            applicationStatus = "Rejected";
        }

        else if (actionName === "Cancel") {
            applicationStatus = "Cancelled";
        }

        else if (actionName === "Approve") {
            applicationStatus = "Approved";
        }


        await client.query(
            `
            UPDATE workflow_applications
            SET
                current_state_id = $1,
                application_status = $2,
                updated_at = NOW()
            WHERE application_id = $3
            `,
            [
                nextStateId,
                applicationStatus,
                applicationId
            ]
        );

console.log(nextStateId, "nextStateId");
        // =====================================================
        // 6. Workflow History
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
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8,
                NOW(),
                $9
            )
            `,
            [
                applicationId,
                currentTask.task_id,
                currentStateId,
                nextStateId,
                actionId,
                assignedOffice,
                userId,
                remarks || null,
                ipAddress || null
            ]
        );


    
// =====================================================
// 7. REJECT / CANCEL
// =====================================================

if (
    actionName === "Reject" ||
    actionName === "Cancel"
) {

    await client.query("COMMIT");

    return {
        applicationId,
        action: actionName,
        status: applicationStatus,
        nextStateId,
        assignedTo: null,
        message:
            `Application ${actionName.toLowerCase()}ed successfully`
    };
}



// =====================================================
// 9. FINAL APPROVAL / NO NEXT ROLE
// =====================================================

if (
    actionName === "Approve" &&
    !nextRoleId
) {

    await client.query("COMMIT");

    return {
        applicationId,
        action: actionName,
        status: "Approved",
        nextStateId,
        nextRoleId: null,
        assignedTo: null,
        taskId: null,
        message:
            "Application approved successfully"
    };
}


// =====================================================
// 10. NORMAL FORWARD
// =====================================================

if (!nextRoleId) {

    throw new Error(
        "Next role is not configured for this transition"
    );
}
   
  

        // =====================================================
        // 9. Find Next Officer
        // =====================================================

        const officerResult = await client.query(
            `
            SELECT id
            FROM users
            WHERE office_id = $1
            AND role_id = $2
            AND is_active = true
            LIMIT 1
            `,
            [
                assignedOffice,
                nextRoleId
            ]
        );

        if (officerResult.rows.length === 0) {

            throw new Error(
                "Officer for next role not found"
            );

        }

        const assignedTo =
            officerResult.rows[0].id;


        // =====================================================
        // 10. Create Next Task
        // =====================================================

        const nextTaskResult = await client.query(
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
                $1,
                $2,
                $3,
                $4,
                $5,
                'Pending',
                NOW()
            )
            RETURNING task_id
            `,
            [
                applicationId,
                nextStateId,
                assignedTo,
                assignedOffice,
                nextRoleId
            ]
        );


        await client.query("COMMIT");


        return {

            applicationId,

            action: actionName,

            status: applicationStatus,

            nextStateId,

            nextRoleId,

            assignedTo,

            taskId:
                nextTaskResult.rows[0].task_id

        };

    }
    catch (error) {

        await client.query("ROLLBACK");

        throw error;

    }
    finally {

        client.release();

    }

};