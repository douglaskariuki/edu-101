import User from '../models/user.model';
import errorHandler from "../helpers/errorHandler.js";
import {hashPassword} from "../utils/auth";

const create = async (req, res) => {
    try {
        const user = new User();
        const { name, email, password } = req.body;

        user.name = name;
        user.email = email
        user.password = await hashPassword(password);

        console.log({user})

        await user.save()
        return res.status(200).json({
            message: "Successfully signed up!"
        })
    } catch (error) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(error)
        })
    }
}

/**
 * Load user and append to req.
 */
const userByID = async (req, res, next, id) => {
    try {
        let user = await User.findById(id)
        if (!user)
            return res.status('400').json({
                error: "User not found"
            })
        req.profile = user
        next()
    } catch (err) {
        return res.status('400').json({
            error: "Could not retrieve user"
        })
    }
}

const read = (req, res) => {
    req.profile.password = undefined
    return res.json(req.profile)
}

const isEducator = (req, res, next) => {
    const isEducator = req.profile && req.profile.educator
    if(!isEducator) {
        return res.status('403').json({
            error: "User is not an educator"
        })
    }

    next()
}

const update = async (req, res) => {
    try {
        let user = req.profile
        user = extend(user, req.body)
        user.updated = Date.now()
        await user.save()
        user.password = undefined
        res.json(user)
    } catch (error) {
        res.status(400).json({
            error: errorHandler.getErrorMessage(error)
        })
    }
}

const remove = async (req, res) => {
    try {
        let user = req.profile
        let deletedUser = await user.remove()
        deletedUser.password = undefined
        res.json(deletedUser)
    } catch(error) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(error)
        })
    }
}

export default {create, read, userByID, isEducator, remove, update}