import { Application } from "../models/applicationModel.js"
import { Job } from "../models/jobModel.js";

export const applyJob = async (req, res, next) => {

    const jobId = req.params.id;
    const alreadyApplied = await Application.findOne({ job: jobId, applicant: req.id });
    if (alreadyApplied) {
        return res.status(400).json({
            message: "You have already applied for this jobs",
            success: false
        });
    }
    const job = await Job.findById(jobId);
    if (!job) {
        return res.status(404).json({
            message: "Job not found",
            success: false
        })
    }

    const newApplication = await Application.create({
        job: jobId,
        applicant: req.id,
    });

    job.applications.push(newApplication._id);
    await job.save();

    return res.status(201).json({
        message: "Job applied successfully.",
        success: true
    })
}

export const getAppliedJobs = async (req, res, next) => {

    const application = await Application.find({ applicant: req.id }).sort({ createdAt: -1 }).populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: {
            path: "company",
            options: { sort: { createdAt: -1 } }
        }
    })

    if (!application.length) {
        return res.status(404).json({
            message: "No Applied jobs",
            success: false
        })
    }
    return res.status(200).json({
        application,
        success: true
    })
}


export const getApplicants = async (req, res, next) => {

    const jobId = req.params.id;
    const applicants = await Job.findById(jobId).populate({
        path: 'applications',
        options: { sort: { createdAt: -1 } },
        populate: {
            path: 'applicant'
        }
    });
    if (!applicants) {
        return res.status(404).json({
            message: 'Applicant not found.',
            success: false
        })
    };
    return res.status(200).json({
        applicants,
        succees: true
    });
}

export const updateStatus = async (req, res, next) => {

    let { status } = req.body;
    const applicationId = req.params.id;
    status = status.toLowerCase();
    if (status !== "accepted" && status !== "rejected") {
        return res.status(400).json({
            message: 'Status Accepted and rejected are allow',
            success: false
        })
    };

    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
        return res.status(404).json({
            message: "Application not found.",
            success: false
        })
    };


    application.status = status;
    await application.save();

    return res.status(200).json({
        message: "Status updated successfully.",
        success: true
    });
}