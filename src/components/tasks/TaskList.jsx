import { Loader2, PlusCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { task } from "../../services/apis";
import axios from "axios";
import Loader from "../Loader";
import CategorySelect from "../CategorySelect";
import { CategoryContext } from "../../context/categoryContext";
import { useOutletContext } from "react-router-dom";
import { TaskContext } from "../../context/taskContext";
import TaskCard from "./TaskCard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subTaskSchema } from "../../zodSchemas/subTaskSchema";


const TaskList = () => {

    const setIsTaskModalOpen  = useOutletContext();
    const [allTasks, setAllTasks] = useState([]);
    const [filteredTask, setFilteredTask] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [isCreateSubtaskModal, setIsCreateSubtaskModal] = useState(false);
    const [subtaskParentId, setSubTaskParentId] = useState(false);
    const [loading, setLoading] = useState(false);

    const {getCategories, categories} = useContext(CategoryContext);
    const {loader, taskList, getTask} = useContext(TaskContext)
    const token = JSON.parse(localStorage.getItem("token"));

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: zodResolver(subTaskSchema),
        defaultValues: {
            title: ""
        }
    })

    useEffect(() => {

        getCategories();
        getTask();
        
    }, [])
    
    useEffect(() => {
        setAllTasks(taskList);
        
    }, [taskList])

    // Filter task by categories
    useEffect(() => {
        if(selectedCategory === "All Categories"){
            setFilteredTask(allTasks);
        }
        else{
            const filteredTasks = taskList.filter((task) => task.categoryId?.name === selectedCategory)
            setFilteredTask(filteredTasks);
        }
    }, [selectedCategory, allTasks])


    const onTaskComplete = async(taskId) => {
        try{
            const result = await axios.put(task.COMPLETE_TASK_API, {todoId: taskId}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if(result.data.success){
                console.log("Task completed");
                const toastId = toast(
                    "Success",
                    {
                        description: result.data.message,
                        action: {
                            label: "Dismiss",
                            onClick: () => {
                                toast.dismiss(toastId);
                            }
                        }
                    }
                )

                // updating the UI immediately
                setAllTasks((prev) => (
                    prev.map((task) => (
                        task._id === taskId ? {...task, status: "Completed"} : task
                    ))
                ))

                setFilteredTask((prev) => (
                    prev.map((task) => (
                        task._id === taskId ? {...task, status: "Completed"} : task
                    ))
                ))
            }
        }
        catch(error){
            if(error.response){
                console.log("Error response:", error.response.data);
                const toastId = toast(
                    "Failed",
                    {
                        description: error.response.data.message,
                        action: {
                            label: "Dismiss",
                            onClick: () => {
                                toast.dismiss(toastId);
                            }
                        }
                    }
                )
            }
            else{
                console.log("An error occurred:", error.message);
                const toastId = toast(
                    "Failed",
                    {
                        description: "Internal server error",
                        action: {
                            label: "Dismiss",
                            onClick: () => {
                                toast.dismiss(toastId);
                            }
                        }
                    }
                )
            }
        }
    }

    const onTaskDelete = async(taskId) => {

        // If status is not equal to completed then return 
        const taskToDelete = allTasks.find(task => task._id === taskId);
        if (!taskToDelete || taskToDelete.status !== "Completed") {
            const toastId = toast(
                "Failed",
                {
                    description: "You have to complete the task and related subtasks before deleting it",
                    action: {
                        label: "Dismiss",
                        onClick: () => {
                            toast.dismiss(toastId);
                        }
                    }
                }
            )
            return;
        }

        try{
            const result = await axios.delete(task.DELETE_TASK_API, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    todoId: taskId
                }
            })

            if(result.data.success){
                console.log("Task deleted successfully");
                getTask();
            }
        }
        catch(error){
            if(error.response){
                console.log("Error response:", error.response.data);
                const toastId = toast(
                    "Failed",
                    {
                        description: error.response.data.message,
                        action: {
                            label: "Dismiss",
                            onClick: () => {
                                toast.dismiss(toastId);
                            }
                        }
                    }
                )
            }
            else{
                console.log("An error occurred:", error.message);
                const toastId = toast(
                    "Failed",
                    {
                        description: "Internal server error",
                        action: {
                            label: "Dismiss",
                            onClick: () => {
                                toast.dismiss(toastId);
                            }
                        }
                    }
                )
            }
        }
    }


    const subtaskSubmitHandler = async(data) => {
        setLoading(true);

        try{
            const result = await axios.post(task.CREATE_SUBTASK_API, {
                    title: data.title, 
                    todoId: subtaskParentId
                },
                {
                    headers: {Authorization: `Bearer ${token}`}
                }
            )

            if(result.data.success){
                console.log("Subtask created successfully");
                const toastId = toast(
                    "Success",
                    {
                        description: result.data.message,
                        action: {
                            label: "Dismiss",
                            onClick: () => {
                                toast.dismiss(toastId);
                            }
                        }
                    }
                )
                getTask();
                setIsCreateSubtaskModal(false);
            }
        }
        catch(error){
            if(error.response){
                console.log("Error response:", error.response.data);
                const toastId = toast(
                    "Failed",
                    {
                        description: error.response.data.message,
                        action: {
                            label: "Dismiss",
                            onClick: () => {
                                toast.dismiss(toastId);
                            }
                        }
                    }
                )
            }
            else{
                console.log("An error occurred:", error.message);
                const toastId = toast(
                    "Failed",
                    {
                        description: "Internal server error",
                        action: {
                            label: "Dismiss",
                            onClick: () => {
                                toast.dismiss(toastId);
                            }
                        }
                    }
                )
            }
        }
        finally{
            setLoading(false);
        }
    }

    const handleSubtaskComplete = async(taskId, subtaskId) => {
        try{
            const result = await axios.put(task.COMPLETE_SUBTASK_API, { taskId, subtaskId }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if(result.data.success){
                console.log("Sub task completed");
                const toastId = toast(
                    "Success",
                    {
                        description: result.data.message,
                        action: {
                            label: "Dismiss",
                            onClick: () => {
                                toast.dismiss(toastId);
                            }
                        }
                    }
                )

                // updating the UI immediately
                setAllTasks((prev) => (
                    prev.map((task) => {
                        if(task._id === taskId){

                            // Updating the subtask status
                            const updatedSubtask = task.subTasks.map((sub) => sub._id === subtaskId ? {...sub, isCompleted: true} : sub);

                            // Updating the status of task based on condition
                            const allCompleted = updatedSubtask.every((sub) => sub.isCompleted);
                            return {
                                ...task,
                                subTasks: updatedSubtask,
                                status: allCompleted ? "Completed" : "In-progress"
                            }
                        }
                        return task;
                    })
                ))

                setFilteredTask((prev) => (
                    prev.map((task) => {
                        if(task._id === taskId){

                            // Updating the subtask status
                            const updatedSubtask = task.subTasks.map((sub) => sub._id === subtaskId ? {...sub, isCompleted: true} : sub);

                            // Updating the status of task based on condition
                            const allCompleted = updatedSubtask.every((sub) => sub.isCompleted);
                            return {
                                ...task,
                                subTasks: updatedSubtask,
                                status: allCompleted ? "Completed" : "In-progress"
                            }
                        }
                        return task;
                    })
                ))
            }
        }
        catch(error){
            if(error.response){
                console.log("Error response:", error.response.data);
                const toastId = toast(
                    "Failed",
                    {
                        description: error.response.data.message,
                        action: {
                            label: "Dismiss",
                            onClick: () => {
                                toast.dismiss(toastId);
                            }
                        }
                    }
                )
            }
            else{
                console.log("An error occurred:", error.message);
                const toastId = toast(
                    "Failed",
                    {
                        description: "Internal server error",
                        action: {
                            label: "Dismiss",
                            onClick: () => {
                                toast.dismiss(toastId);
                            }
                        }
                    }
                )
            }
        }
    }



    return (
        <>
            <CategorySelect 
                categories={categories}
                selected={selectedCategory}
                setSelected={setSelectedCategory}
            />
        
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl px-2 py-4 mb-6 md:mb-0 md:p-6 border border-white/20">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Your Tasks</h2>
                    <button
                        onClick={() => setIsTaskModalOpen(true)}
                        className="flex items-center gap-2 font-semibold bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg transition"
                    >
                        <PlusCircle size={18}/> Add Task
                    </button>
                </div>

                {
                    loader ? (
                        <Loader />
                    )
                    :
                    (
                        filteredTask.length <= 0 ? (
                            <div className="text-[1.1rem] font-semibold text-center">
                                <h1>
                                    {
                                        selectedCategory === "All Categories" ? (
                                            "No Task Added"
                                        )
                                        :
                                        (
                                           <span>
                                                No task added in{" "}
                                                <span className="text-red-600 font-bold">{selectedCategory} Section</span>
                                            </span>
                                        )
                                    }
                                </h1>
                                <h2>
                                    Please add tasks, and boost your productivity 🎯💪🏻
                                </h2>
                            </div>
                        )
                        :
                        (
                            <ul className="space-y-3">
                                {
                                    filteredTask.map((task) => (
                                        <li
                                            key={task._id}
                                        >
                                            <TaskCard 
                                                task={task}
                                                onComplete={onTaskComplete} 
                                                onDelete={onTaskDelete}
                                                onAddSubtask={(taskId) => {
                                                    setSubTaskParentId(taskId)
                                                    setIsCreateSubtaskModal(true)
                                                }}
                                                onSubtaskComplete={handleSubtaskComplete}
                                            />
                                        </li>
                                    ))
                                }
                            </ul>
                        )
                    )
                }
            </div>

            {
                isCreateSubtaskModal && (
                    <div className="fixed inset-0 flex justify-center items-center z-50">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCreateSubtaskModal(false)}></div>
                        {/* Modal Content */}
                            <div className="relative bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 w-[97%] md:w-1/2 max-w-lg z-10">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold">Add Sub task</h2>
                                    <button
                                        onClick={() => setIsCreateSubtaskModal(false)}
                                        className="text-white text-lg font-bold cursor-pointer"
                                    >
                                        ✖
                                    </button>
                                </div>
                            
                                {/* Modal Form */}
                                <form onSubmit={handleSubmit(subtaskSubmitHandler)} className="space-y-6">
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        {...register("title")}
                                        className="w-full px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:outline-none"
                                    />
                                    {errors.title && <p className="text-red-500 text-sm -mt-3 md:-mt-6 text-left">{errors.title.message}</p>}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center gap-2 justify-center w-full bg-gradient-to-r from-red-600/60 to-red-800/60 hover:bg-red-800 px-4 py-2 rounded-lg text-white font-semibold transition"
                                    >
                                        {
                                            loading ? (
                                                <div className="flex items-center justify-center">
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin"/>  Please wait
                                                </div> 
                                            )
                                            :
                                            (
                                                <>
                                                    <PlusCircle size={18} /> Add
                                                </> 
                                            )
                                        }
                                    </button>
                                </form>
                            </div>
                    </div>
                )
            }
        </>

        
    )
}

export default TaskList;