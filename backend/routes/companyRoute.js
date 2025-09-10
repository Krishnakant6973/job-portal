import express from "express";
import { getAllCompanies, getCompanyById, registerCompany, updateCompany } from "../controllers/companyController.js";
import { singleUpload } from "../middlewares/multer.js";
import wrapAsync from "../utils/wrapAsync.js";

export const companyRoutes = express.Router();

companyRoutes.post("/register", wrapAsync(registerCompany));
companyRoutes.put("/update/:id", singleUpload, wrapAsync(updateCompany));
companyRoutes.get("/get", wrapAsync(getAllCompanies));
companyRoutes.get("/get/:id", wrapAsync(getCompanyById));
