import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: 'Email is required'
    },
    password: {
        type: String,
        required: "Password is required"
    },
    about: {
        type: String,
        trim: true
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    created: {
        type: Date,
        default: Date.now
    },
    educator: {
        type: Boolean,
        default: false
    },
    updated: Date,
});

export default mongoose.model("User", UserSchema);