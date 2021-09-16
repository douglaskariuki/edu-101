import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import config from '../config/config.js';
import User from '../models/user.model.js';
import { comparePassword } from "../utils/auth";

const signin = async (req, res) => {
    try {
        let user = await User.findOne({
            "email": req.body.email
        })

        if(!user) {
            return res.status("401").json({ error: "Incorrect credentials" })
        }
  
        const match = await comparePassword(req.body.password, user.password)

        const token = jwt.sign({
            _id: user._id
        }, config.jwtSecret)


        res.cookie(
            "t", 
            token, 
            {expire: new Date() + 9999}
        )
  
        return res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                educator: user.educator
            }
        })
  
    } catch (err) {
        return res.status('401').json({
            error: "Could not sign in"
        })
    }
}


const signout = (req, res) => {
    res.clearCookie("t")
    return res.status("200").json({
        message: "Signed out"
    })
}

const requireSignin = expressJwt({
    secret: config.jwtSecret,
    algorithms: ['HS256'],
    userProperty: "auth"
}) // uses express-jwt to verify that the incoming request has a valid jwt in the Authorization header, if valid it appends the verified user's ID in a "auth" key

const hasAuthorization = (req, res, next) => {
    const authorized = 
        req.profile 
        && req.auth 
        && req.profile._id == req.auth._id // req.auth obj is populated by express-jwt, req.profile is populated by the userByID func in user.controller
    if(!(authorized)) {
        return res.status("403").json({
            error: "User is not authorized"
        })
    } 
    next()
} // add this function to routes that require both authentication and authorization

export default { signin, signout, requireSignin, hasAuthorization }