import { Request, Response } from "express";
import pool from "../db";


export const createApplication = async (
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
            house_type,
            annual_income
        } = req.body;


        const files: any = req.files;


        const incomeCertificate =
            files?.income_certificate
                ? files.income_certificate[0].filename
                : null;


        const addressProof =
            files?.address_proof
                ? files.address_proof[0].filename
                : null;



        const userId = req.user.id;

        const workflow_id = 1; // Housing workflow

        const draftStateId = 1;

        const submitActionId = 1;



        /*
            Get Applicant Office
        */

        const officeResult = await client.query(
        `
        SELECT o.office_id
        FROM users u
        JOIN offices o
        ON u.district=o.district
        AND
        (
            u.block_id=o.block_id
            OR
            (
                u.block_id IS NULL
                AND o.block_id IS NULL
            )
        )
        WHERE u.id=$1
        `,
        [
            userId
        ]);


        if(officeResult.rows.length===0)
        {
            throw new Error("Office not found");
        }


        const assignedOffice =
            officeResult.rows[0].office_id;



        /*
            Check Existing Draft
        */

        const existingDraft =
        await client.query(
        `
        SELECT application_id
        FROM workflow_applications
        WHERE created_by=$1
        AND workflow_id=$2
        AND current_state_id=$3
        LIMIT 1
        `,
        [
            userId,
            workflow_id,
            draftStateId
        ]);



        let applicationId:number;



        /*
            If Draft exists
        */

        if(existingDraft.rows.length>0)
        {

            applicationId =
                existingDraft.rows[0].application_id;



            await client.query(
            `
            UPDATE applications_housing
            SET
                applicant_name=$1,
                mobile_number=$2,
                address=$3,
                house_type=$4,
                annual_income=$5,
                income_certificate=$6,
                address_proof=$7
            WHERE id=$8
            `,
            [
                applicant_name,
                mobile_number,
                address,
                house_type,
                annual_income,
                incomeCertificate,
                addressProof,
                applicationId
            ]);

        }



        /*
            If no Draft create new application
        */

        else
        {

            const application_no =
                "AppHousing-" + Date.now();



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
                $1,$2,$3,$4,$5,$6,NOW(),NOW()
            )
            RETURNING application_id
            `,
            [
                workflow_id,
                application_no,
                userId,
                assignedOffice,
                draftStateId,
                "Draft"
            ]);



            applicationId =
                applicationResult.rows[0].application_id;



            await client.query(
            `
            INSERT INTO applications_housing
            (
                id,
                applicant_name,
                mobile_number,
                address,
                house_type,
                annual_income,
                income_certificate,
                address_proof
                
            )
            VALUES
            ($1,$2,$3,$4,$5,$6,$7,$8)
            `,
            [
                applicationId,
                applicant_name,
                mobile_number,
                address,
                house_type,
                annual_income,
                incomeCertificate,
                addressProof
                
            ]);

        }


// =====================================================
// 5. Find Current Transition
// =====================================================

const fromStateId = draftStateId; // Current state before Submit

const transitionResult = await client.query(
`
SELECT
    action_id,
    to_state_id
FROM workflow_transitions
WHERE workflow_id = $1
AND from_state_id = $2
AND action_id = $3
`,
[
    workflow_id,
    fromStateId,
    submitActionId
]
);

if (transitionResult.rows.length === 0) {
    throw new Error("Invalid workflow transition");
}

const actionId =
    transitionResult.rows[0].action_id;

const nextStateId =
    transitionResult.rows[0].to_state_id;


// =====================================================
// 6. Find Role Responsible For Next State
// =====================================================

const nextRoleResult = await client.query(
`
SELECT role_id
FROM workflow_transitions
WHERE workflow_id = $1
AND from_state_id = $2
LIMIT 1
`,
[
    workflow_id,
    nextStateId
]
);

if (nextRoleResult.rows.length === 0) {
    throw new Error("Next role not found");
}

const nextRoleId =
    nextRoleResult.rows[0].role_id;


// =====================================================
// 7. Find Officer For That Role
// =====================================================

const assignedToResult = await client.query(
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
    throw new Error("Officer assigned to not found");
}

const assignedTo =
    assignedToResult.rows[0].id;

        // =====================================================
        // 7. Create Workflow Task
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
        // 8. Create Workflow History
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
                1,
                2,
                actionId,
                assignedOffice,
                userId,
                "Application Submitted",
                req.ip
            ]
        );

        // =====================================================
        // 9. Update Current State
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
        // 10. Commit Transaction
        // =====================================================

        await client.query("COMMIT");

        res.status(201).json({
            message: "Application Submitted Successfully",
            applicationId
        });

    } catch (error) {

        await client.query("ROLLBACK");

        console.log(error);

        res.status(500).json({
            message: "Application submission failed"
        });

    } finally {

        client.release();

    }

};



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//++++++++++++++++++++++++++++++++//Save Draft API//+++++++++++++++++++++++++++++++++++++++++++++++++++//
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//



export const saveDrafthousingbyId = async (
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
            house_type,
            annual_income
        } = req.body;

        const files: any = req.files;
        console.log("REQ FILES:");
console.log(files);

        const incomeCertificate =
            files?.income_certificate
                ? files.income_certificate[0].filename
                : null;

        const addressProof =
            files?.address_proof
                ? files.address_proof[0].filename
                : null;
        
        const userId = req.user.id;

        const workflowId = 1;
        const draftStateId = 1;

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
UPDATE applications_housing
SET
    applicant_name=$1,
    mobile_number=$2,
    address=$3,
    house_type=$4,
    annual_income=$5,

    income_certificate =
    COALESCE($6,income_certificate),

    address_proof =
    COALESCE($7,address_proof)

WHERE id=$8
`,
[
    applicant_name,
    mobile_number,
    address,
    house_type,
    annual_income,
    incomeCertificate,
    addressProof,
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
                "AppHousing-" + Date.now();

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
                INSERT INTO applications_housing
                (
                    id,
                    applicant_name,
                    mobile_number,
                    address,
                    house_type,
                    annual_income,
                    income_certificate,
                    address_proof
                    
                )
                VALUES
                (
                    $1,$2,$3,$4,$5,$6,$7,$8
                )
                `,
                [
                    applicationId,
                    applicant_name,
                    mobile_number,
                    address,
                    house_type,
                    annual_income,
                    incomeCertificate,
                    addressProof,
                    
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

export const getDrafthousingbyId = async (
    req: Request,
    res: Response
) => {
    
    try {

        const userId = req.user.id;

        const result = await pool.query(
        `
        SELECT
            ah.*
        FROM workflow_applications wa
        JOIN applications_housing ah
        ON wa.application_id = ah.id
        WHERE wa.created_by = $1
        AND wa.workflow_id = 1
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