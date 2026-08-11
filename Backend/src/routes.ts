import express from "express";
import { getMenus } from "./controllers/menucontroller";
import { verifyToken } from "./middleware/authmiddleware";

import upload from "./middleware/multer"; 

import { createApplication } from "./controllers/applicationcontroller";
import { saveDrafthousingbyId } from "./controllers/applicationcontroller";
import { getDrafthousingbyId } from "./controllers/applicationcontroller";


import { addUser } from "./controllers/registrationcontroller";
import { loginUser } from "./controllers/logincontroller";

import { getApplicationbyId, getPendingApplications } from "./controllers/applicationworkflowcontroller";
import { getDashboardStats } from "./controllers/dashboardcontroller";

import { performAction } from "./controllers/applicationworkflowcontroller";


import { getServices } from "./controllers/servicecontroller";
import { getDraftApplications, getSubmittedApplications } from "./controllers/servicecontroller";

import { createboilerApplication } from "./controllers/boilercontroller";
import { saveDraftboiler } from "./controllers/boilercontroller";
import { getDraftboiler } from "./controllers/boilercontroller";

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
    saveDrafthousingbyId
);
router.get(
    "/applications/housing/edit/:id",
    verifyToken,
    getDrafthousingbyId
);


// ===============================
//Housing Application Route
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

    getApplicationbyId

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

//common routes
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


//Boiler Service Routes

router.post(
    "/applications/boiler",

    verifyToken,

    upload.fields([
        {
            name:"boiler_certificate",
            maxCount:1
        }
    ]),

    createboilerApplication
);

router.post(
    "/applications/boiler/draft",
     verifyToken,
    upload.fields([
        {
            name:"boiler_certificate",
            maxCount:1
        }
    ]),
    saveDraftboiler
);
router.get(
    "/applications/boiler/edit/:id",
    verifyToken,
    getDraftboiler
);
export default router;