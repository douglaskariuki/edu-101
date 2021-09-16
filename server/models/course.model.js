import mongoose from "mongoose";


const lessonSchema = new mongoose.Schema({
    title: String,
    content: String,
    resourse_url: String
})

const Lesson = mongoose.model('Lesson', lessonSchema)

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        data: Buffer,
        contentType: String
    },
    category: {
        type: String,
        required: 'Category is required'
    },
    published: {
        type: Boolean,
        default: false
    },
    instructor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    updated: Date,
    created: {
        type: Date,
        default: Date.now
    },
    lessons: [lessonSchema]
})


export default mongoose.model("Course", courseSchema)