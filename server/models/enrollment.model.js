import mongoose from "mongoose";

// visitors will sign in and then enroll on any of published courses
// enrolling will give access to course lessons
const EnrollmentSchema = new mongoose.Schema({
    course: { // store reference to the course doc which the wnrollment is associated
        type: mongoose.Schema.ObjectId,
        ref: 'Course'
    },
    student: { // ref to user creating the enrollment
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    lessonStatus: [{ // store an array with refs to each lesson that is stored in the associated course
        lesson: { type: mongoose.Schema.ObjectId, ref: 'Lesson' },
        complete: Boolean
    }],
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    updated: Date, // updated everytime a lesson is updated
    completed: Date // set when all the lessons have been completed
})

export default mongoose.model('Enrollment', EnrollmentSchema)