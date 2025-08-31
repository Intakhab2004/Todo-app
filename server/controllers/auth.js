const User = require("../models/User");
const Category = require("../models/Category");
const sendMail = require("../config/mailConfig");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


exports.signUp = async(req, res) => {
    const {username, email, password, confirmPassword} = req.body;

    if(!username || !email || !password || !confirmPassword){
        return res.status(404).json({
            success: false,
            message: "All input fields are required"
        })
    }

    if(password !== confirmPassword){
        console.log("The two password entered is not same");
        return res.status(401).json({
            success: false,
            message: "Entered passwords are not same"
        })
    }

    try{
        // Some useful operations
        const otpCode = Math.floor(Math.random() * 900000 + 100000).toString();
        const otpExpiry = new Date(Date.now() + 3600000);
        const hashedPassword = await bcrypt.hash(password, 10);


        const existingUser = await User.findOne({
            $or: [{email}, {username}]
        })

        if(existingUser){
            if(existingUser.isVerified){
                if(existingUser.email === email){
                    console.log("User already exists with this email");
                    return res.status(401).json({
                        success: false,
                        message: "User already exists with this email"
                    })
                }

                if(existingUser.username === username){
                    console.log("User already exists with this username");
                    return res.status(401).json({
                        success: false,
                        message: "User already exists with this username"
                    })
                }
            }

            existingUser.username = username;
            existingUser.email = email;
            existingUser.password = hashedPassword;
            existingUser.otp = otpCode;
            existingUser.otpExpiry = otpExpiry;

            await existingUser.save();
        }

        else{
            const newUser = new User({
                username,
                email,
                password: hashedPassword,
                otp: otpCode,
                otpExpiry
            })
            await newUser.save();
        }

        // Sending mail to new user
        const mailResponse = await sendMail({username: username, email: email, otp: otpCode});
        if(!mailResponse.success){
            return res.status(403).json({
                success: false,
                message: mailResponse.message
            })
        }

        return res.status(200).json({
            success: true,
            message: "User created successfully, Please check your email for verification code"
        })
    }

    catch(error){
        console.log("Something went wrong: ", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


exports.verifyCode = async(req, res) => {
    const {otpCode, email} = req.body;

    if(!otpCode || !email){
        return res.status(404).json({
            success: false,
            message: "All input fields are required"
        })
    }

    try{
        const currentUser = await User.findOne({email});
        if(!currentUser){
            console.log("User not found with this email");
            return res.status.json({
                success: false,
                message: "User not found with this email"
            })
        }

        const otpNotExpired = new Date(currentUser.otpExpiry) > Date.now();
        const validOtp = currentUser.otp === otpCode;

        if(otpNotExpired && validOtp){
            currentUser.isVerified = true;
            await currentUser.save();

            // Creating default categories for new user
            await Category.insertMany([
                {name: "Personal", color: "#74D4FF", userId: currentUser._id},
                {name: "Professional", color: "#1a6904ff", userId: currentUser._id}
            ])

            return res.status(200).json({
                success: true,
                message: "OTP verified successfully"
            })
        }

        else if(!otpNotExpired){
            return res.status(401).json({
                success: false,
                message: "OTP has expired, Please sign up again to generate new otp"
            })
        }

        else{
            return res.status(403).json({
                success: false,
                message: "The otp you have sent is not valid"
            })
        }
    }
    catch(error){
        console.log("Something went wrong: ", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
    
}


exports.signIn = async(req, res) => {
    try{
        const {identifier, password} = req.body;

        if(!identifier || !password){
            return res.status(404).json({
                success: false,
                message: "All input fields are mandatory"
            })
        }

        const existingUser = await User.findOne({
            $or: [
                {email: identifier},
                {username: identifier}
            ]
        })
        if(!existingUser){
            console.log("User not found with the given credentials");
            return res.status(404).json({
                success: false,
                message: "User is not registered. Please create account before login."
            })
        }

        const checkPassword = await bcrypt.compare(password, existingUser.password);
        if(!checkPassword){
            console.log("Incorrect password");
            return res.status(403).json({
                success: false,
                message: "Password is incorrect"
            })
        }

        // Creating payload for JWT
        const payload = {
            id: existingUser._id,
            email: existingUser.email,
            username: existingUser.username,
            verified: existingUser.isVerified
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "7d"});
        existingUser.token = token;
        existingUser.password = undefined;

        const cookieOptions = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }

        res.cookie("token", token, cookieOptions).status(200).json({
            success: true,
            token,
            existingUser,
            message: "User Logged in successfully"
        })
    }
    catch(error){
        console.log("Something went wrong: ", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}