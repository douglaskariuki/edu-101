import express from "express";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import path from "path";
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import courseRoutes from "./routes/course.routes.js";
import enrollmentRoutes from "./routes/enrollment.routes.js";

const CURRENT_WORKING_DIR = process.cwd();

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())
app.use(helmet())
app.use(cors())

app.use('/', authRoutes)
app.use('/', userRoutes)
app.use('/', courseRoutes)
app.use('/', enrollmentRoutes)

// Auth error handling for express-jwt, unauthorized errors
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({"error" : err.name + ": " + err.message})
    } else if (err) {
        res.status(400).json({"error" : err.name + ": " + err.message})
        console.log(err)
    }
})

export default app;