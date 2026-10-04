import {
    hotelGuideCreate,
    hotelGuideList,
    hotelGuideUpdate,
    hotelGuideDelete
} from "../controller/hotelGuideController.js";

import express from "express";

import {authenticated,isAdmin} from "../middleware/authenticatedMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();


// =========================
// Dashboard Site
// =========================

// CREATE
router.post(
    "/admin/hotel-guide/create",
    authenticated,
    isAdmin,
    upload.fields([
        {
            name: "main_image",
            maxCount: 1
        },
        {
            name: "image1",
            maxCount: 1
        },
        {
            name: "image2",
            maxCount: 1
        },
        {
            name: "image3",
            maxCount: 1
        }
    ]),
    hotelGuideCreate
);


// LIST
router.get(
    "/admin/hotel-guide/list",
    authenticated,
    isAdmin,
    hotelGuideList
);


// UPDATE
router.put(
    "/admin/hotel-guide/update/:id",
    authenticated,
    isAdmin,
    upload.fields([
        {
            name: "main_image",
            maxCount: 1
        },
        {
            name: "image1",
            maxCount: 1
        },
        {
            name: "image2",
            maxCount: 1
        },
        {
            name: "image3",
            maxCount: 1
        }
    ]),
    hotelGuideUpdate
);


// DELETE
router.delete(
    "/admin/hotel-guide/delete/:id",
    authenticated,
    isAdmin,
    hotelGuideDelete
);


// =========================
// Website / Mobile Site
// =========================

router.get(
    "/mobile/hotel-guide/list",
    authenticated,
    hotelGuideList
);


export default router;