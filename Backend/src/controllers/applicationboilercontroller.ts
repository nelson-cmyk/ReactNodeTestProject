import { Request, Response } from "express";
import pool from "../db";


export const createboilerApplication = async (
    req: Request,
    res: Response
) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        // =====================================================
        // 1. Get Form Data
        // =====================================================

        const {
            applicant_name,
            mobile_number,
            address,
            boiler_type,
            boiler_capacity,
            year_of_installation,
            purpose
        } = req.body;


        const files: any = req.files;


        const boilerCertificateFilename =
            files?.boiler_certificate
                ? files.boiler_certificate[0].filename
                : null;


        const userId = req.user.id;

        const workflowId = 2;

        // Application Draft
        const draftStateId = 10;

        // Submit
        const submitActionId = 1;


        // =====================================================
        // 2. Get Applicant Office
        // =====================================================

        const officeResult = await client.query(
            `
            SELECT o.office_id
            FROM users u
            JOIN offices o
                ON u.district = o.district
                AND (
                    u.block_id = o.block_id
                    OR (
                        u.block_id IS NULL
                        AND o.block_id IS NULL
                    )
                )
            WHERE u.id = $1
            `,
            [userId]
        );


        if (officeResult.rows.length === 0) {

            throw new Error("Office not found");

        }


        const assignedOffice =
            officeResult.rows[0].office_id;


        // =====================================================
        // 3. Check Existing Draft
        // =====================================================

        const existingDraft = await client.query(
            `
            SELECT application_id
            FROM workflow_applications
            WHERE created_by = $1
            AND workflow_id = $2
            AND current_state_id = $3
            LIMIT 1
            `,
            [
                userId,
                workflowId,
                draftStateId
            ]
        );


        let applicationId: number;


        // =====================================================
        // 4. Update Existing Draft
        // =====================================================

        if (existingDraft.rows.length > 0) {

            applicationId =
                existingDraft.rows[0].application_id;


            await client.query(
                `
                UPDATE boiler_applications
                SET
                    applicant_name = $1,
                    mobile_number = $2,
                    address = $3,
                    boiler_type = $4,
                    boiler_capacity = $5,
                    year_of_installation = $6,
                    purpose = $7,
                    boiler_certificate =
                        COALESCE($8, boiler_certificate)
                WHERE id = $9
                `,
                [
                    applicant_name,
                    mobile_number,
                    address,
                    boiler_type,
                    boiler_capacity,
                    year_of_installation,
                    purpose,
                    boilerCertificateFilename,
                    applicationId
                ]
            );


        }

        // =====================================================
        // 5. Create New Application
        // =====================================================

        else {

            const applicationNo =
                "APPBoiler-" + Date.now();


            const applicationResult =
                await client.query(
                    `
                    INSERT INTO workflow_applications
                    (
                        workflow_id,
                        application_no,
                        created_by,
                        office_id,
                        current_state_id,
                        application_status,
                        created_at,
                        updated_at
                    )
                    VALUES
                    (
                        $1,
                        $2,
                        $3,
                        $4,
                        $5,
                        $6,
                        NOW(),
                        NOW()
                    )
                    RETURNING application_id
                    `,
                    [
                        workflowId,
                        applicationNo,
                        userId,
                        assignedOffice,
                        draftStateId,
                        "Draft"
                    ]
                );


            applicationId =
                applicationResult.rows[0].application_id;


            await client.query(
                `
                INSERT INTO boiler_applications
                (
                    id,
                    applicant_name,
                    mobile_number,
                    address,
                    boiler_type,
                    boiler_capacity,
                    year_of_installation,
                    purpose,
                    boiler_certificate
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
                    $9
                )
                `,
                [
                    applicationId,
                    applicant_name,
                    mobile_number,
                    address,
                    boiler_type,
                    boiler_capacity,
                    year_of_installation,
                    purpose,
                    boilerCertificateFilename
                ]
            );

        }


        // =====================================================
        // 6. Current State
        // =====================================================

        const currentStateId = draftStateId;


        // =====================================================
        // 7. Find Submit Transition
        //
        // 10 → 11
        // Submit
        // Applicant → Verifier
        // =====================================================

        const transitionResult =
            await client.query(
                `
                SELECT
                    action_id,
                    from_state_id,
                    to_state_id,
                    role_id,
                    next_role_id
                FROM workflow_transitions
                WHERE workflow_id = $1
                AND from_state_id = $2
                AND action_id = $3
                AND role_id = $4
                LIMIT 1
                `,
                [
                    workflowId,
                    currentStateId,
                    submitActionId,
                    req.user.role_id
                ]
            );


        if (transitionResult.rows.length === 0) {

            throw new Error(
                "Invalid workflow transition"
            );

        }


        const transition =
            transitionResult.rows[0];


        const actionId =
            transition.action_id;


        const nextStateId =
            transition.to_state_id;


        const nextRoleId =
            transition.next_role_id;


        console.log(
            "Current State:",
            currentStateId
        );

        console.log(
            "Next State:",
            nextStateId
        );

        console.log(
            "Current Role:",
            transition.role_id
        );

        console.log(
            "Next Role:",
            nextRoleId
        );


        // =====================================================
        // 8. Validate Next Role
        // =====================================================

        if (!nextRoleId) {

            throw new Error(
                "Next role is not configured for this transition"
            );

        }


        // =====================================================
        // 9. Find Officer For Next Role
        // =====================================================

        const assignedToResult =
            await client.query(
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


        if (assignedToResult.rows.length === 0) {

            throw new Error(
                "Officer assigned to next role not found"
            );

        }


        const assignedTo =
            assignedToResult.rows[0].id;


        // =====================================================
        // 10. Create Workflow Task
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
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    NOW()
                )
                RETURNING task_id
                `,
                [
                    applicationId,
                    nextStateId,
                    assignedTo,
                    assignedOffice,
                    nextRoleId,
                    "Pending"
                ]
            );


        const taskId =
            taskResult.rows[0].task_id;


        // =====================================================
        // 11. Workflow History
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
                taskId,
                currentStateId,
                nextStateId,
                actionId,
                assignedOffice,
                userId,
                "Application Submitted",
                req.ip
            ]
        );


        // =====================================================
        // 12. Update Application State
        // =====================================================

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
                "Submitted",
                applicationId
            ]
        );


        // =====================================================
        // 13. Commit
        // =====================================================

        await client.query("COMMIT");


        res.status(201).json({

            message:
                "Application Submitted Successfully",

            applicationId,

            applicationNo:
                "APPBoiler-" + applicationId,

            currentStateId,

            nextStateId,

            nextRoleId,

            assignedTo,

            taskId

        });

    }
    catch (error: any) {

        await client.query("ROLLBACK");

        console.log(
            "Boiler application submission error:",
            error
        );


        res.status(500).json({

            message:
                error.message ||
                "Application submission failed"

        });

    }
    finally {

        client.release();

    }

};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//++++++++++++++++++++++++++++++++//Save Draft API//+++++++++++++++++++++++++++++++++++++++++++++++++++//
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//



export const saveDraftboiler = async (
    req: Request,
    res: Response
) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const {
            applicant_name,
            mobile_number,
            address,
            boiler_type,
            boiler_capacity,    
            year_of_installation,
            purpose
        } = req.body;

        const files: any = req.files;

        const boilerCertificateFilename =
            files?.boiler_certificate
                ? files.boiler_certificate[0].filename
                : null;

       
        
        const userId = req.user.id;

        const workflowId = 2;
        const draftStateId = 10;

        // Get applicant office
        const officeResult = await client.query(
            `
            SELECT o.office_id
            FROM users u
            JOIN offices o
            ON u.district = o.district
            AND (
                u.block_id = o.block_id
                OR (
                    u.block_id IS NULL
                    AND o.block_id IS NULL
                )
            )
            WHERE u.id = $1
            `,
            [userId]
        );

        if (officeResult.rows.length === 0) {
            throw new Error("Office not found");
        }

        const officeId = officeResult.rows[0].office_id;

        // Check existing draft
        const draftResult = await client.query(
            `
            SELECT application_id
            FROM workflow_applications
            WHERE created_by = $1
            AND workflow_id = $2
            AND current_state_id = $3
            LIMIT 1
            `,
            [
                userId,
                workflowId,
                draftStateId
            ]
        );

        let applicationId: number;

        if (draftResult.rows.length > 0) {

            // Existing draft

            applicationId = draftResult.rows[0].application_id;

            await client.query(
`
UPDATE boiler_applications
SET
    applicant_name=$1,
    mobile_number=$2,
    address=$3,
    boiler_type=$4,
    boiler_capacity=$5,
    year_of_installation=$6,
    purpose=$7,
    boiler_certificate =
    COALESCE($8,boiler_certificate)
WHERE id=$9
`,
[
    applicant_name,
    mobile_number,
    address,
    boiler_type,
    boiler_capacity,
    year_of_installation,
    purpose,
    boilerCertificateFilename,
    applicationId
]
);

            await client.query(
                `
                UPDATE workflow_applications
                SET updated_at = NOW()
                WHERE application_id = $1
                `,
                [applicationId]
            );

        } else {

            // Create new draft

            const applicationNo =
                "AppBoiler-" + Date.now();

            const workflowResult = await client.query(
                `
                INSERT INTO workflow_applications
                (
                    workflow_id,
                    application_no,
                    created_by,
                    office_id,
                    current_state_id,
                    application_status,
                    created_at,
                    updated_at
                )
                VALUES
                (
                    $1,$2,$3,$4,$5,$6,NOW(),NOW()
                )
                RETURNING application_id
                `,
                [
                    workflowId,
                    applicationNo,
                    userId,
                    officeId,
                    draftStateId,
                    "Draft"
                ]
            );

            applicationId =
                workflowResult.rows[0].application_id;

            await client.query(
                `
                INSERT INTO boiler_applications
                (
                    id,
                    applicant_name,
                    mobile_number,
                    address,
                    boiler_type,
                    boiler_capacity,
                    year_of_installation,
                    purpose,
                    boiler_certificate
                    
                )
                VALUES
                (
                    $1,$2,$3,$4,$5,$6,$7,$8,$9
                )
                `,
                [
                    applicationId,
                    applicant_name,
                    mobile_number,
                    address,
                    boiler_type,
                    boiler_capacity,
                    year_of_installation,
                    purpose,
                    boilerCertificateFilename
                ]
            );

        }

        await client.query("COMMIT");

        res.status(200).json({
            message: "Draft saved successfully",
            applicationId
        });

    } catch (error: any) {

        await client.query("ROLLBACK");

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    } finally {

        client.release();

    }

};


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

export const getDraftboiler = async (
    req: Request,
    res: Response
) => {
    
    try {
        console.log("Fetching draft application with ID:", req.params.id);
        const userId = req.user.id;

        const result = await pool.query(
        `
        SELECT
            ah.*
        FROM workflow_applications wa
        JOIN boiler_applications ah
        ON wa.application_id = ah.id
        WHERE wa.created_by = $1
        AND wa.workflow_id = 2
        AND wa.current_state_id = 1
        LIMIT 1
        `,
        [userId]);

        if(result.rows.length === 0){

            return res.json({
                hasDraft:false
            });

        }

        res.json({

            hasDraft:true,

            application:result.rows[0]

        });

    }
    catch(error){

        console.log(error);

        res.status(500).json({
            message:"Error loading draft"
        });

    }

};