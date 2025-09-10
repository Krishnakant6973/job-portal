export const recruiterRole = async (req, res, next) => {
    try {
        if (req.role !== "recruiter") {
            return res.status(403).json(
                {
                    message: "You are not recruiter can't access",
                    success: false
                }
            )
        }
        return next();
    }
    catch (err) {
        console.log(err)
    }
}


export const studentRole = async (req, res, next) => {
    try {
        if (req.role !== "student") {
            return res.status(403).json(
                {
                    message: "You are not student can't access",
                    success: false
                }
            )
        }
        return next();
    }
    catch (err) {
        console.log(err)
    }
}