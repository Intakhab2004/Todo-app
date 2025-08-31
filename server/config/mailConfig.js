const nodemailer = require("nodemailer");
const otpTemplate = require("../mailTemplate/otpVerification");


async function sendMail({username, email, otp}){
    try{
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })

        const mailOptions = {
            from: `TaskHunter ${process.env.MAIL_USER}`,
            to: email,
            subject: "TaskHunter | Verification Code",
            html: otpTemplate(otp, username)
        }

        const response = await transporter.sendMail(mailOptions);
        if(response.accepted.length > 0){
            return {
                success: true,
                status: 200,
                message: "Verification code sent successfully"
            }
        }

        return {
            success: false,
            status: 401,
            message: "Something went wrong while sending mail"
        }
    }
    catch(error){
        console.log("An error occured while sending mail: ", error.message);
        return {
            success: false,
            status: 500,
            message: "Internal server error"
        }
    }
}

module.exports = sendMail;