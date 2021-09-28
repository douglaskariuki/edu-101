import express from 'express'
import authController from "../controllers/auth.controller.js"
import enrollmentController from "../controllers/enrollment.controller.js"
import courseController from '../controllers/course.controller.js'

const router = express.Router()

router.route('/api/enrollment/new/:courseId')
    .post(
        authController.requireSignin,
        enrollmentController.findEnrollment,
        enrollmentController.create
    )

router.route('/api/enrollment/:enrollmentId')
    .get(
        authController.requireSignin,
        enrollmentController.isStudent,
        enrollmentController.read
    )
    
router.param('enrollmentId', enrollmentController.enrollmentById)

router.param('courseId', courseController.courseById)

export default router