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

const isEducator = (req, res, next) => {
    const isEducator = req.profile && req.profile.educator
    if(!isEducator) {
        return res.status('403').json({
            error: "User is not an educator"
        })
    }

    next()
}

export default {create, userByID, isEducator}