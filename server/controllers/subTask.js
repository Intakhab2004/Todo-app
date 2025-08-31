const SubTask = require("../models/SubTasks");
const Task = require("../models/Tasks");


exports.createSubTask = async(req, res) => {
    try{
        const { title, todoId } = req.body;

        const todo = await Task.findById(todoId);
        if(!todo){
            return res.status(404).json({
                success: false,
                message: "Todo not found with the given ID"
            })
        }

        const newSubTask = await SubTask.create({title: title, taskId: todoId});
        if(!newSubTask){
            return res.status(403).json({
                success: false,
                message: "An error occured while creating subtask"
            })
        }

        todo.subTasks.push(newSubTask._id);
        await todo.save();
        
        return res.status(200).json({
            success: true,
            message: "SubTask created successfully"
        })
    }
    catch(error){
        console.log("Something went wrong while creating the subtasks");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


exports.markCompleteSubTask = async(req, res) => {
    try{
        const {taskId, subtaskId} = req.body;
        if(!taskId || !subtaskId){
            console.log("Data missing");
            res.status(400).json({
                success: false,
                message: "Data is missing"
            })
        }

        const subTask = await SubTask.findById(subtaskId);
        if(!subTask){
            return res.status(404).json({
                success: false,
                message: "Sub task not found"
            })
        }

        if(subTask.isCompleted){
            console.log("Sub task have already been completed");
            return res.status(403).json({
                success: false,
                message: "Sub task have already been completed"
            })
        }

        subTask.isCompleted = true;
        await subTask.save();

        const task = await Task.findById(taskId).populate("subTasks");

        const incompleteSubTask = task.subTasks.some(sub => sub.isCompleted === false);
        if(incompleteSubTask){
            task.status = "In-progress";
            await task.save();
        }
        else{
            task.status = "Completed"
            await task.save();
        }

        return res.status(200).json({
            success: true,
            message: "Sub task mark as completed"
        })

    }
    catch(error){
        console.log("Something went wrong while creating the subtasks");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

