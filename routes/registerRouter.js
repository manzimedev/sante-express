import express from "express";

import registerController from "../controllers/registerController.js";

const router = express.Router();

router.route("/").post(registerController.createOne);

export default router;
