import express from "express";
import { getMenus } from "./controllers/menucontroller";
import { verifyToken } from "./middleware/authmiddleware";

import upload from "./middleware/multer"; 

import { createApplication } from "./controllers/applicationcontroller";
import { saveDraft } from "./controllers/applicationcontroller";
import { getDraft } from "./controllers/applicationcontroller";


import { addUser } from "./controllers/registrationcontroller";
import { loginUser } from "./controllers/logincontroller";

import { getApplication, getPendingApplications } from "./controllers/applicationworkflowcontroller";
import { getDashboardStats } from "./controllers/dashboardcontroller";

import {
performAction
}
from "./controllers/applicationworkflowcontroller";
import { getServices } from "./controllers/servicecontroller";
import {
    getDraftApplications,
    getSubmittedApplications
} from "./controllers/servicecontroller";


const router = express.Router();


router.post(
"/workflow/action",
verifyToken,
performAction
);

router.get(
 "/menus",
 verifyToken,
 getMenus
);


router.post("/register", addUser);

router.post("/login", loginUser);







// ===============================
// Existing Routes
// ===============================




router.post(
    "/applications/draft",
     verifyToken,
    upload.fields([
        {
            name:"income_certificate",
            maxCount:1
        },
        {
            name:"address_proof",
            maxCount:1
        }
    ]),
    saveDraft
);

router.get(
    "/applications/housing/draft",
    verifyToken,
    getDraft
);

// ===============================
// Application Route
// ===============================

router.post(
    "/applications",

    verifyToken,

    upload.fields([
        {
            name:"income_certificate",
            maxCount:1
        },
        {
            name:"address_proof",
            maxCount:1
        }
    ]),

    createApplication
);
//pending applications route
router.get("/applications/pending", verifyToken, getPendingApplications);
router.get(

    "/workflow/application/:id",

    verifyToken,

    getApplication

);

//dashboard route
router.get(
    "/dashboard",
    verifyToken,
    getDashboardStats
);

//service route
router.get(
    "/services",
    verifyToken,
    getServices
);


router.get(
    "/applications/drafts/:workflowId",
    verifyToken,
    getDraftApplications
);

router.get(
    "/applications/submitted/:workflowId",
    verifyToken,
    getSubmittedApplications
);
export default router;