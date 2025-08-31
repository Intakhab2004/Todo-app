const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth")

const {
    createCategory,
    getCategory
} = require("../controllers/category");


router.post("/create-category", auth, createCategory);
router.get("/get-category", auth, getCategory);

module.exports = router;