import { Company } from "../models/companyModel.js"
import { User } from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";
import getDataUri from "../config/datauri.js";

export const registerCompany = async (req, res, next) => {
    const { name } = req.body || {};
    if (!name) {
        return res.status(400).json(
            {
                message: "Company name is required ",
                success: false
            }
        )
    }
    let company = await Company.findOne({ name });
    if (company) {
        return res.status(400).json(
            {
                message: "Company name already exist",
                success: false
            }
        )
    }
    company = await Company.create({
        name,
        userId: req.id
    })

    const user = await User.findById(req.id);
    user.profile.companies.push(company._id);
    await user.save();

    return res.status(200).json(
        {
            message: "Company registered successfully",
            company,
            success: true
        }
    )
}

export const getAllCompanies = async (req, res, next) => {
    const userId = req.id;
    const companies = await Company.find({ userId });
    if (!companies.length) {
        return res.status(404).json(
            {
                message: "Companies not found",
                success: false
            }
        )
    }

    return res.status(200).json(
        {
            companies,
            success: true
        }
    )
}

export const getCompanyById = async (req, res, next) => {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
    if (!company) {
        return res.status(404).json({
            message: "Company not found.",
            success: false
        })
    }

    return res.status(200).json({
        company,
        success: true
    })
}

export const updateCompany = async (req, res, next) => {
    const { name, description, website, location } = req.body || {};
    const companyId = req.params.id;
    let cloudResponse;
    if (req.file) {
        const fileUri = getDataUri(req.file);
        cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    }
    let logo = cloudResponse?.secure_url;
    const company = await Company.findByIdAndUpdate(companyId, { name, description, website, location, logo }, { new: true, runValidators: true });
    if (!company) {
        return res.status(404).json({
            message: "Company not found.",
            success: false
        })
    }
    return res.status(200).json({
        message: "Company information updated.",
        company,
        success: true
    })
}

