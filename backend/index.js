import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { dbConnect } from "./config/db.js";
import { userRoutes } from "./routes/userRoute.js";
import { companyRoutes } from "./routes/companyRoute.js";
import { isAuthenticated } from "./middlewares/isAuthenticated.js";
import { recruiterRole } from "./middlewares/roleAuthorization.js";
import { jobRoutes } from "./routes/jobRoute.js";
import { applicationRoutes } from "./routes/applicationRoute.js";
import cors from "cors"
//initializing the app
const app = express();

config();//loding the .env file 

dbConnect();

//middlewares

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.json())

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
}

app.use(cors(corsOptions));

//routes 

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/company", isAuthenticated, recruiterRole, companyRoutes)
app.use("/api/v1/job", isAuthenticated, jobRoutes);
app.use("/api/v1/application", isAuthenticated, applicationRoutes);


const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})


app.use((err, req, res, next) => {
    console.log(err)
    let { _message } = err;
    return res.status(400).json({ success: false, message: _message })
})

