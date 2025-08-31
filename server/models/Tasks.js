const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title of the task is required"],
    },

    description: {
        type: String,
    },

    status: {
        type: String,
        enum: ["Pending", "In-progress", "Completed"],
        default: "Pending"
    },

    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Low"
    },

    dueDate: {
        type: Date
    },

    categoryId: {
        type: mongoose.Types.ObjectId,
        ref: "Category"
    },

    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },

    subTasks: [{
        type: mongoose.Types.ObjectId,
        ref: "SubTask"
    }],

    createdAt: {
        type: Date,
        default: Date.now
    }
})

const taskModel = mongoose.model("Task", taskSchema);
module.exports = taskModel;