import express from "express";
import { getAllJobs, getAlljobsByRecruiter, getJobById, postJob } from "../controllers/jobController.js";
import { recruiterRole, studentRole } from "../middlewares/roleAuthorization.js";
import wrapAsync from "../utils/wrapAsync.js";
export const jobRoutes = express.Router();

jobRoutes.get("/get/job/:id", wrapAsync(getJobById));
jobRoutes.get("/get/jobs", studentRole, wrapAsync(getAllJobs));
jobRoutes.get("/get/jobs/r", recruiterRole, wrapAsync(getAlljobsByRecruiter));
jobRoutes.post("/post/job", recruiterRole, wrapAsync(postJob));