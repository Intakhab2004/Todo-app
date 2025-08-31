import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { taskSchema } from "../../zodSchemas/taskSchema";
import { useContext, useState } from "react";
import CategorySelect from "../CategorySelect";
import { CategoryContext } from "../../context/categoryContext";
import { toast } from "sonner";
import axios from "axios";
import { task } from "../../services/apis";
import { TaskContext } from "../../context/taskContext";


const CreateTaskModal = ({setIsTaskModalOpen}) => {
    const [loader, setLoader] = useState(false);
    const {categories} = useContext(CategoryContext);
    const {taskList, setTaskList} = useContext(TaskContext);

    const token = JSON.parse(localStorage.getItem("token"));


    const { register, handleSubmit, formState: {errors} } = useForm({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            categoryName: "",
            priority: ""
        }
    })


    const submitHandler = async(data) => {
        setLoader(true);
        setIsTaskModalOpen(true);

        const payLoad = {
            ...data,
            dueDate: new Date(data.dueDate)
        }

        try{
            const result = await axios.post(task.CREATE_TASK_API, payLoad, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if(result.data.success){
                console.log("Task created successfully");
                const toastId = toast(
                    "Success",
                    {
                        description: result.data.message,
                        action: {
                            label: "Dismiss",
                            onClick: () => {
                                toast.dismiss(toastId)
                            }
                        }
                    }
                )

                setTaskList([...taskList, result.data.newTask]);
            }
        }
        catch(error){
            if(error.response){
                console.log("Error response is: ", error.response.data);
                const toastId = toast(
                    "Failed",
                    {
                        description: error.response.data.message,
                        action: {
                            label: "Dismiss",
                            onClick: () => {
                                toast.dismiss(toastId)
                            }
                        }
                    }
                )
            }
            else{
                console.log("Something went wrong: ", error.message);
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
            setLoader(false);
            setIsTaskModalOpen(false);
        }
    }



    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsTaskModalOpen(false)}></div>

            {/* Modal Content */}
            <div className="relative bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 px-3 py-6 md:p-6 w-[96%] md:w-1/2 max-w-lg z-10">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Add New Task</h2>
                    <button
                        onClick={() => setIsTaskModalOpen(false)}
                        className="text-white text-lg font-bold cursor-pointer"
                    >
                        ✖
                    </button>
                </div>

                {/* Modal Form */}
                <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
                    <label className="block text-left mb-1 ml-1 text-white/90">Title of the task <span className="text-2xl text-pink-700"> *</span></label>
                    <input
                        type="text"
                        placeholder="Enter task"
                        {...register("title")}
                        className="w-full px-3 py-2 rounded-lg border border-gray-500 bg-gradient-to-r from-black/70 to-gray-700 text-white"
                    />
                    {errors.title && <p className="text-red-500 text-sm -mt-3 md:-mt-4 text-left">{errors.title.message}</p>}

                    <label className="block text-left mb-1 ml-1 text-white/90">Description of Task</label>
                    <textarea
                        type="text"
                        rows={3}
                        placeholder="Add some details about the task"
                        {...register("description")}
                        className="w-full px-3 py-2 rounded-lg border border-gray-500 bg-gradient-to-r from-black/70 to-gray-700 text-white"
                    />
                    {errors.description && <p className="text-red-500 text-sm -mt-3 md:-mt-5 text-left">{errors.description.message}</p>}

                    <div className="flex justify-between">
                        <div>
                            <label className="block text-left mb-1 ml-1 text-white/90">
                                Category <span className="text-2xl text-pink-700"> *</span>
                            </label>
                            <select
                                {...register("categoryName")}
                                className="w-full md:w-[11.5rem] bg-black/65 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold rounded-lg px-2 py-2 focus:outline-none cursor-pointer"
                            >
                                <option value="" disabled className="bg-black/90 text-white">
                                    Select Category
                                </option>
                                {
                                    categories.map((category) => (
                                        <option
                                            key={category._id}
                                            value={category.name}
                                            className="bg-black/90 text-white"
                                        >
                                            {category.name}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-left mb-1 ml-1 text-white/90">
                                Priority <span className="text-2xl"></span>
                            </label>
                            <select
                                {...register("priority")}
                                className="w-full md:w-[11.5rem] bg-black/65 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold rounded-lg px-2 py-2 focus:outline-none cursor-pointer"
                            >
                                <option value="" disabled className="bg-black/90 text-white">
                                    Select Priority
                                </option>
                                <option value="Low" className="bg-black/90 text-white">
                                    Low
                                </option>
                                <option value="Medium" className="bg-black/90 text-white">
                                    Medium
                                </option>
                                <option value="High" className="bg-black/90 text-white">
                                    High
                                </option>
                            </select>
                        </div>
                    </div>

                    <label className="block text-left mb-1 ml-1 text-white/90">
                        Date to Finish the task <span className="text-2xl text-pink-700"> *</span>
                    </label>
                    <input
                        type="date"
                        {...register("dueDate")}
                        className="w-[44%] md:w-2/5 px-3 py-2 rounded-lg bg-black/65 backdrop-blur-sm border border-white/20 text-white font-semibold 
                        focus:outline-none cursor-pointer"
                    />
                    {errors.dueDate && <p className="text-red-500 text-sm -mt-3 md:-mt-4 text-left">{errors.dueDate.message}</p>}

                    <button
                        type="submit"
                        disabled={loader}
                        className="flex items-center gap-2 justify-center w-full bg-gradient-to-r from-red-600/60 to-red-800/60 hover:bg-red-800 px-4 py-2 rounded-lg text-white font-semibold transition"
                    >
                        {
                            loader ? (
                                <div className="flex items-center justify-center">
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin"/>  Please wait
                                </div> 
                            )
                            :
                            (
                                <>
                                    <PlusCircle size={18} /> Add Task
                                </> 
                            )
                        }
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreateTaskModal;