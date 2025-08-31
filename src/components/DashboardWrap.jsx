import { Link, useNavigate, Outlet } from "react-router-dom";
import { Loader2, LogOut, PlusCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema } from "../zodSchemas/categorySchema";
import { toast } from "sonner";
import axios from "axios";
import { category } from "../services/apis";
import { CategoryContext } from "../context/categoryContext";
import CreateTaskModal from "./tasks/CreateTaskModal";
import { TaskContext } from "../context/taskContext";

const DashboardWrap = () => {
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();
    const {categories, setCategories, getCategories} = useContext(CategoryContext);
    const {setTaskList} = useContext(TaskContext);
    const token = JSON.parse(localStorage.getItem("token"));

    const { register, handleSubmit, formState: {errors} } = useForm({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: ""
        }
    })

    useEffect(() => {
        getCategories();
    }, [])


    const formSubmitHandler = async(data) => {
        setLoader(true);
        setIsCategoryModalOpen(true);
        try{
            const result = await axios.post(category.CREATE_CATEGORY, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if(result.data.success){
                setCategories([...categories, result.data.newCategory])
                console.log("Category created successfully");
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
            setLoader(false);
            setIsCategoryModalOpen(false);
        }
    }


    const logoutHandler = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setTaskList([]);
        setCategories([]);

        navigate("/", { replace: true });
    }


  return (
        <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-950 text-white overflow-hidden px-3 md:px-6 pb-20">
            <div className="absolute top-0 left-0 w-72 h-72 bg-red-700 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-700 rounded-full blur-3xl opacity-20"></div>

            <header className="relative z-10 flex items-center justify-between py-7">
                <h1 className="text-2xl md:text-3xl font-bold">
                    Task<span className="text-red-500">Hunter</span>
                </h1>
                <button onClick={logoutHandler} className="flex items-center gap-2 font-semibold bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition">
                    <LogOut size={18} /> Logout
                </button>
            </header>

            {/* Main Content */}
            <div className="relative z-10 mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">

                {/* Sidebar */}
                <div className="hidden md:block md:col-span-1 bg-white/10 backdrop-blur-lg p-5 rounded-2xl shadow-lg border border-white/20">
                    <h2 className="text-lg font-semibold mb-4">Menu</h2>
                    <ul className="space-y-3">
                        <li><Link to="/dashboard" className="hover:text-red-400">🏠 Overview</Link></li>
                        <li><button onClick={() => setIsTaskModalOpen(true)} className="hover:text-red-400">➕ Create Task</button></li>
                        <button
                            onClick={() => setIsCategoryModalOpen(true)}
                            className="flex items-center gap-2 hover:text-red-400 font-medium"
                        >
                            📂 Add more Categories
                        </button>
                    </ul>
                </div>

                {/* For rendering all the nested element of the dashboard route */}
                <Outlet context={setIsTaskModalOpen}/>
            </div>

            <div className="fixed bottom-0 left-0 w-full md:hidden bg-white/10 backdrop-blur-lg p-3 border-t border-white/20 flex justify-around items-center text-sm z-50">
                <Link to="/dashboard" className="flex flex-col items-center">
                    🏠 <span>Overview</span>
                </Link>
                <button onClick={() => setIsTaskModalOpen(true)} className="flex flex-col items-center hover:text-red-400">
                    ➕ <span>Task</span>
                </button>
                <button onClick={() => setIsCategoryModalOpen(true)} className="flex flex-col items-center hover:text-red-400">
                    📂 <span>Category</span>
                </button>
            </div>

            {/* Create category modal */}
            {
                isCategoryModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCategoryModalOpen(false)}></div>

                        {/* Modal Content */}
                        <div className="relative bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 px-3 py-4 md:p-6 w-[96%] md:w-1/2 max-w-lg z-10">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Add New Category</h2>
                                <button
                                    onClick={() => setIsCategoryModalOpen(false)}
                                    className="text-white text-lg font-bold cursor-pointer"
                                >
                                    ✖
                                </button>
                            </div>

                            {/* Modal Form */}
                            <form onSubmit={handleSubmit(formSubmitHandler)} className="space-y-6">
                                <input
                                    type="text"
                                    placeholder="Category Name"
                                    {...register("name")}
                                    className="w-full px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:outline-none"
                                />
                                {errors.name && <p className="text-red-500 text-sm -mt-3 md:-mt-6 text-left">{errors.name.message}</p>}
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
                                                <PlusCircle size={18} /> Add Category
                                            </> 
                                        )
                                    }
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }

            {
                isTaskModalOpen && <CreateTaskModal setIsTaskModalOpen={setIsTaskModalOpen} />
            }
        </div>
    )
}

export default DashboardWrap;
