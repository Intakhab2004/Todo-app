const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Category name is required"]
    },

    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
})

const categoryModel = mongoose.model("Category", categorySchema);
module.exports = categoryModel;