import { Job } from "../models/jobModel.js";
//for recruiter
export const postJob = async (req, res, next) => {
    const { title, description, requirements, salary, experienceLevel, location, jobType, position, company } = req.body || {};
    const userId = req.id;
    if (!title || !description || !requirements || !salary || !experienceLevel || !location || !jobType || !position || !company) {
        return res.status(400).json({
            message: "Something is missing.",
            success: false
        })
    }
    const job = await Job.create(
        {
            title,
            description,
            requirements: requirements.split(","),
            salary,
            location,
            jobType,
            experienceLevel,
            position,
            company,
            createdBy: userId
        }
    );
    return res.status(201).json({
        message: "Job created successfully.",
        job,
        success: true
    });
}

//for student
export const getAllJobs = async (req, res, next) => {
    const keyword = req.query.keyword;
    console.log("Keyword:", keyword);
    const words = keyword.split(" ").filter(word => word.trim() !== "");
    const regex = words.map(word => `(${word})`).join("|");
    console.log(regex)
    const query = {
        $or: [
            { title: { $regex: regex, $options: "i" } },
            { description: { $regex: regex, $options: "i" } }
        ]
    }
    const jobs = await Job.find(query).populate({
        path: "company"
    }).sort({ createdAt: -1 });
    console.log(jobs);
    if (!jobs.length) {
        return res.status(404).json({
            message: "Jobs not found.",
            success: false
        })
    };
    return res.status(200).json({
        jobs,
        success: true
    })
}


//for both 
export const getJobById = async (req, res, next) => {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
        path: "applications"
    })
    if (!job) {
        return res.status(404).json({
            message: "Jobs not found",
            success: false
        })
    }
    return res.status(200).json({ job, success: true });
}

//for recruiter 
export const getAlljobsByRecruiter = async (req, res, next) => {
    const jobs = await Job.find({ createdBy: req.id }).populate({
        path: "company"
    }).sort({ createdAt: -1 });

    if (!jobs.length) {
        return res.status(404).json({
            message: "Jobs not found.",
            success: false
        })
    };
    return res.status(200).json({
        jobs,
        success: true
    })
}