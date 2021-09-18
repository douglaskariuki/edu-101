import mongoose from "mongoose";
import config from "./config/config.js";
import app from "./express.js";

mongoose.Promise = global.Promise
mongoose.connect(config.mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then((conn, error) => {
    if(error) {
        console.log(`Error: ${error}`)
    }

    console.log("connected")
})

app.listen(config.port, (err) => {
    if (err) {
        console.log(err)
    }
    console.log('Server started on port %s.', config.port)
})