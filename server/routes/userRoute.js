const express = require("express");
const router = express.Router();

const { 
    signUp, 
    signIn, 
    verifyCode
} = require("../controllers/auth");


router.post("/sign-up", signUp);
router.post("/verify-code", verifyCode);
router.post("/sign-in", signIn);

module.exports = router;