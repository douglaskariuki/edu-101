import express from "express";
import userController from "../controllers/user.controller";
import authController from "../controllers/auth.controller";
import courseController from "../controllers/course.controller";

const router = express.Router()

router.route('/api/courses/by/:userId')
    .post(
        authController.requireSignin, 
        authController.hasAuthorization, 
        userController.isEducator, 
        courseController.create
    )

router.route("/api/courses/photo/:courseId")
    .get(
        courseController.getImage,
        courseController.defaultPhoto
    )

router.route("/api/courses/defaultPhoto")
    .get(courseController.defaultPhoto)

router.route('/api/courses/by/:userId')
    .get(
        authController.requireSignin, 
        authController.hasAuthorization, 
        courseController.listByInstructor
    )

router.route('/api/courses/:courseId')
    .get(courseController.read)

router.route('/api/courses/:courseId/lesson/new')
    .put(
        authController.requireSignin, 
        courseController.isInstructor, 
        courseController.newLesson
    )

router.route('/api/courses/:courseId')
    .put(authController.requireSignin, courseController.isInstructor, courseController.update)

router.route('/api/courses/:courseId')
    .delete(authController.requireSignin, courseController.isInstructor, courseController.remove)

router.param('courseId', courseController.courseById)

router.param('userId', userController.userByID)

export default router;
