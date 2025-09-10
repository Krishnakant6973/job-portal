import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"
import getDataUri from "../config/datauri.js"
import cloudinary from "../config/cloudinary.js";

export const register = async (req, res, next) => {
    let { fullName, email, phoneNumber, password, role } = req.body || {};
    email = email?.toLowerCase();
    if (!fullName || !email || !phoneNumber || !password || !role) {
        return res.status(400).json({
            message: "Something is missing",
            success: false
        });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "Invalid email format",
            success: false
        });
    }

    if (role !== "student" && role !== "recruiter") {
        return res.status(400).json({
            message: "Allow roles are student or recruiter ",
            success: false
        });
    }

    const user = await User.findOne({ email });

    if (user) {
        return res.status(400).json({
            message: "User already exist with this email",
            success: false
        });
    }



    const hashPassword = await bcrypt.hash(password, 10);

    const file = req.file;
    let cloudResponse;
    if (file) {
        const fileUri = getDataUri(file);
        cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    }

    await User.create({
        fullName,
        email,
        phoneNumber,
        password: hashPassword,
        role,
        profile: {
            profilePhoto: cloudResponse?.secure_url,
        }
    });


    return res.status(201).json({
        message: "Account created Successfully",
        success: true
    });
}


export const login = async (req, res, next) => {
    let { email, password, role } = req.body || {};
    email = email?.toLowerCase();
    if (!email || !password || !role) {
        return res.status(400).json({
            message: "Something is missing",
            success: false
        });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "Invalid email format",
            success: false
        });
    }

    let user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({
            message: "Incorrect email",
            success: false
        });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        return res.status(400).json({
            message: "Incorrect  password",
            success: false
        });
    }
    if (role !== user.role) {
        return res.status(400).json({
            message: "Account doesn't exist with this role ",
            success: false
        });
    }

    const tokenData = {
        userId: user._id,
        role: user.role
    }

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "15m" });
    return res.status(200).cookie("token", token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict"
    }).json({
        message: "Login Successfully",
        user,
        success: true
    })
}


export const logout = async (req, res, next) => {
    return res.status(200).cookie("token", "", {
        maxAge: 0
    }).json({
        message: "Logged out successfully ",
        success: true
    })
}

export const updateProfile = async (req, res, next) => {
    let { fullName, email, phoneNumber, bio, skills } = req.body || {};

    if (skills) {
        skills = skills.split(" ")
    }
    email = email?.toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email && !emailRegex.test(email)) {
        return res.status(400).json({
            message: "Invalid email format",
            success: false
        });
    }

    let cloudResponse;
    if (req.file) {
        const fileUri = getDataUri(req.file);
        cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
            resource_type: "raw",
            access_mode: "public", 
        });
    }

    let user = {
        fullName,
        email,
        phoneNumber,
        "profile.bio": bio,
        "profile.skills": skills,
    }


    if (cloudResponse) {
        user["profile.resume"] = `${cloudResponse?.secure_url}#toolbar=0&navpanes=0&scrollbar=0`
        user["profile.resumeOriginalName"] = req.file?.originalname
    }

    user = await User.findByIdAndUpdate(req.id, user, { new: true, runValidators: true });
    if (!user) {
        return res.status(404).json({
            message: "User not found ",
            success: false
        })
    }
    return res.status(200).json({
        message: "Profile updated successfully ",
        user,
        success: true
    })
}