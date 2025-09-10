import express from "express"
import { recruiterRole, studentRole } from "../middlewares/roleAuthorization.js";
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/applicationController.js";
import wrapAsync from "../utils/wrapAsync.js";
export const applicationRoutes = express.Router();
applicationRoutes.post("/apply/job/:id", studentRole, wrapAsync(applyJob));
applicationRoutes.get("/applied/jobs", studentRole, wrapAsync(getAppliedJobs));
applicationRoutes.get("/get/applicants/:id", recruiterRole, wrapAsync(getApplicants))
applicationRoutes.put("/update/status/:id", recruiterRole, wrapAsync(updateStatus))