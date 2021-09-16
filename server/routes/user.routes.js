import express from 'express';
import userController from "../controllers/user.controller.js"
import authController from "../controllers/auth.controller.js"

const router = express.Router();

router.route("/api/users")
    .post(userController.create)

export default router;