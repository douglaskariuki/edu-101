import formidable from "formidable";
import Course from "../models/course.model.js";
import extend from "lodash/extend"
import fs from "fs";
import errorHandler from "../helpers/errorHandler.js";
import defaultImage from "../../web/src/assets/default.png"

const create = async (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req, async(err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            })
        }

        let course = new Course(fields)
        course.instructor = req.profile
        if(files.image) {
            course.image.data = fs.readFileSync(files.image.path)
            course.image.contentType = files.image.type
        }

        try {
            let result = await course.save()
            res.json(result)
        } catch (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage()
            })
        }
    })
}

const courseById = async (req, res, next, id) => {
    try {
        let course = await Course.findById(id).populate('instructor', '_id name')

        if(!course) {
            return res.status('400').json({
                error: 'Course not found'
            })
        }
        
        console.log(course)

        req.course = course
        next()
    } catch (error) {
        return res.status('400').json({
            error: errorHandler.getErrorMessage(error)
        })
    }
}

const read = (req, res) => {
    req.course.image = undefined; // images will be retrieved as files in separate routes
    console.log(req.course)
    return res.json(req.course)
}

const update = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req, async(err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: "Photo could not be uploaded"
            })
        }

        let course = req.course
        course = extend(course, fields)

        if(fields.lessons) {
            course.lessons = JSON.parse(fields.lessons)
        }
        course.updated = Date.now()
        if(files.image) {
            course.image.data = fs.readFileSync(files.image.path)
            course.image.contentType = files.image.type
        }

        try {
            await course.save()
            res.json(course)
        } catch(err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(error)
            })
        }
    })
}

const listByInstructor = (req, res) => {
    Course.find({instructor: req.profile._id}, (err, courses) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }

        res.json(courses)
    }).populate('instructor', '_id name')
}

const isInstructor = (req, res, next) => {
    const isInstructor = 
        req.course && req.auth 
        && req.course.instructor._id == req.auth._id

    if(!isInstructor) {
        return res.status('403').json({
            error: 'User is not authorized'
        })
    }

    next()
}

const newLesson = async (req, res, next) => {
    try {
        let lesson = req.body.lesson
        let result = await Course.findByIdAndUpdate(
            req.course._id, 
            {
                $push: {lessons: lesson}, 
                updated: Date.now()
            }, 
            {new: true}
        ).populate('instructor', '_id name').exec()

        res.json(result)
    } catch (error) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(error)
        })
    }
}

const listPublished = (req, res) => {
  Course.find({published: true}, (err, courses) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(courses)
  }).populate('instructor', '_id name')
}

const getImage = (req, res, next) => {
    if(req.course.image.data) {
        res.set("Content-Type", req.course.image.contentType)
        return res.send(req.course.image.data)
    }

    next()
}

const remove = async (req, res) => {
    try {
        let course = req.course
        let deleteCourse = await Course.remove()
        res.json(deleteCourse)
    } catch (error) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(error)
        })
    }
}

const defaultPhoto = (req, res) => {
    return res.sendFile(process.cwd()+defaultImage)
}

export default {create, getImage, listPublished, update, remove, newLesson, isInstructor, defaultPhoto, listByInstructor, read, courseById}