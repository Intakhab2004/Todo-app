const Task = require("../models/Tasks");
const User = require("../models/User");
const Category = require("../models/Category");
const SubTask = require("../models/SubTasks");


exports.createTodo = async(req, res) => {
    try{
        const {title, description, priority, dueDate, categoryName} = req.body;
        const userId = req.user.id;

        if(!title || !dueDate || !categoryName){
            console.log("All fields are mandatory");
            return res.status(402).json({
                success: false,
                message: "All fields are required"
            })
        }

        const user = User.findById({userId});
        if(!user){
            console.log("User not found");
            return res.status(404).json({
                success: false,
                message: "User not found with this id"
            })
        }

        // Getting the desired category
        const category = await Category.findOne({name: categoryName});
        if(!category){
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }

        const newTask = new Task({
            title,
            description: description || "",
            priority,
            dueDate,
            categoryId: category._id,
            userId
        })
        await newTask.save();

        if(!newTask){
            console.log("Something went wrong while creating the task");
            return res.status(401).json({
                success: false,
                message: "An error occured while creating the task"
            })
        }

        return res.status(200).json({
            success: true,
            message: "New Task created successfully",
            newTask
        })

    }
    catch(error){
        console.log("Something went wrong while creating the todo");
        console.error("An error occured: ", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


exports.editTodo = async(req, res) => {
    try{
        const {todoId} = req.params;
        const {title, description, priority, dueDate, categoryName} = req.body;

        const hasValidField = [title, description, priority, dueDate, categoryName].some(
            f => f !== undefined && f !== null && !(typeof f === "string" && f.trim() === "")
        )

        if(hasValidField){
            console.log("Atleast one input fields is required");
            return res.status(401).json({
                success: false,
                message: "Atleast one input field is required"
            })
        }

        const todo = await Task.findById({todoId});
        if(!todo){
            return res.status(404).json({
                success: false,
                message: "Task not found"
            })
        }

        if(title) todo.title = title;
        if(description) todo.description = description;
        if(priority) todo.priority = priority;
        if(dueDate) todo.dueDate = dueDate;
        
        // Getting category
        if(categoryName){
            const category = await Category.findOne({name: categoryName});
            if(!category){
                return res.status(404).json({
                    success: false,
                    message: "Category you have selected not found"
                })
            }
            todo.categoryId = category._id;
        }
        await todo.save();

        return res.status(200).json({
            success: true,
            message: "Todo updated successfully",
            todo
        })
    }
    catch(error){
        console.log("Something went wrong while updating the todo");
        console.error("An error occured: ", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


exports.markCompleteTodo = async(req, res) => {
    try{
        const { todoId } = req.body;
        if(!todoId){
            return res.status(404).json({
                success: false,
                message: "Require task id"
            })
        }

        const todo = await Task.findById(todoId);
        if(!todo){
            return res.status(403).json({
                success: false,
                message: "Task not found with the given id"
            })
        }

        if(todo.status === "Completed"){
            return res.status(400).json({
                success: false,
                message: "Task is already marked as completed"
            })
        }

        todo.status = "Completed";
        await todo.save();

        return res.status(200).json({
            success: true,
            message: "Task marked as completed"
        })
    }
    catch(error){
        console.log("Something went wrong while deleting the todo");
        console.error("An error occured: ", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


exports.deleteTodo = async(req, res) => {
    try{
        const { todoId } = req.query;
    
        const todo = await Task.findById(todoId);
        if(!todo){
            console.log("Task not found with the given id");
            return res.status(404).json({
                success: false,
                message: "Task not found"
            })
        }

        // Deleting all the subtasks related to the given task.
        await SubTask.deleteMany({taskId: todoId});

        // Deleting the given Task
        await Task.findByIdAndDelete(todoId);

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        })
    }
    catch(error){
        console.log("Something went wrong while deleting the todo");
        console.error("An error occured: ", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}