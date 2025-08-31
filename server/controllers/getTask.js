const Task = require("../models/Tasks");
const User = require("../models/User");
const Category = require("../models/Category");

exports.getUserTask = async(req, res) => {
    try{
        const userId = req.user.id;  // req.user have all the token payload which is set in the middleware

        if(!userId){
            console.log("Please provide userId");
            return res.status(402).json({
                success: false,
                message: "UserId has not provided"
            })
        }

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                success: false,
                message: "user not found with this id"
            })
        }

        const task = await Task.find({userId: userId})
                                                    .sort({createdAt: -1})
                                                    .populate({
                                                        path: "subTasks",
                                                        select: "title isCompleted"
                                                    })
                                                    .populate({
                                                        path: "categoryId",
                                                        select: "name"
                                                    })

        if(!task){
            console.log("Something went wrong while fetching the task");
            return res.status(400).json({
                success: false,
                message: "An error occured while fetching the task"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Task fetched successfully",
            task
        })
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
