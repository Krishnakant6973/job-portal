import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'recruiter'],
        required: true,
        lowercase: true
    },
    profile: {
        bio: {
            type: String,
        },
        skills: [String],
        resume: {
            type: String
        },
        resumeOriginalName: {
            type: String
        },
        companies: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company"
        }],
        profilePhoto: {
            type: String,
            default: ""
        }
    }

}, {
    timestamps: true
});
export const User = mongoose.model("User", userSchema)