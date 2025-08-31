const mongoose = require("mongoose");

const subTaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title of the Subtask is required"],
        maxLength: 100
    },

    isCompleted: {
        type: Boolean,
        default: false
    },

    taskId: {
        type: mongoose.Types.ObjectId,
        ref: "Task"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})

const subTaskModel = mongoose.model("SubTask", subTaskSchema);
module.exports = subTaskModel;