const jwt = require("jsonwebtoken");

exports.auth = async(req, res, next) => {
    try{
        const token = req.cookies?.token || req.body?.token || req.header("Authorization")?.replace("Bearer ", "");
        if(!token){
            console.log("Token is required");
            return res.status(404).json({
                success: false,
                message: "Toekn have not provided"
            })
        }

        // verifying the token 
        try{
            const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
            req.user = verifiedToken;
        }
        catch(error){
            return res.status(402).json({
                success: false,
                message: "Something went wrong while verifying the token"
            })
        }
        next();
    }
    catch(error){
        console.log("Something went wrong");
        console.error("The error is: ", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}