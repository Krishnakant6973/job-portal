import express from "express"
import { login, logout, register, updateProfile } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";
import wrapAsync from "../utils/wrapAsync.js";

export const userRoutes = express.Router();
userRoutes.post("/register", singleUpload, wrapAsync(register))
userRoutes.post("/login", wrapAsync(login))
userRoutes.get("/logout", wrapAsync(logout))
userRoutes.put("/profile/update", isAuthenticated, singleUpload, wrapAsync(updateProfile));
