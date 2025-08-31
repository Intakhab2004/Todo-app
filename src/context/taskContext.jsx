import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "sonner";
import { task } from "../services/apis";

export const TaskContext = createContext();

export const TaskProvider = ({children}) => {
    const [loader, setLoader] = useState(false);
    const [taskList, setTaskList] = useState([]);
    
    const getTask = async() => {
        const token = JSON.parse(localStorage.getItem("token"));
        
        setLoader(true);
        try{
            const result = await axios.get(task.GET_TASK_API, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if(result.data.success){
                setTaskList(result.data.task);
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
        }
    }

    return (
        <TaskContext.Provider
            value={{loader, taskList, setTaskList, getTask}}
        >
            {children}
        </TaskContext.Provider>
    )
}