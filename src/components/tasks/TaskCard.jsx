import { CheckCircle, Trash2, ChevronDown, ChevronUp, CirclePlus, Loader2, CircleAlert } from "lucide-react";
import { useState } from "react";
import { dateFormatter, dateRemaining } from "../../services/dateRemaining";

const TaskCard = ({ task, onComplete, onDelete, onAddSubtask, onSubtaskComplete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loadingComplete, setLoadingComplete] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [completeSubtask, setCompleteSubtask] = useState({});

    const { title, status, priority, dueDate, createdAt, subTasks } = task;

    const handleComplete = async() => {
        setLoadingComplete(true);
        await onComplete(task._id);
        setLoadingComplete(false);
    }

    const handleDelete = async() => {
        setLoadingDelete(true);
        await onDelete(task._id);
        setLoadingDelete(false);
    }

    const handleCompleteSubtask = async(subtaskId) => {
        setCompleteSubtask((prev) => ({...prev, [subtaskId]: true}));
        await onSubtaskComplete(task._id, subtaskId);
        setCompleteSubtask((prev) => ({...prev, [subtaskId]: false}));
    }


    return (
        <div
            className={`relative bg-black/60 backdrop-blur-sm border border-white/20 rounded-2xl px-2 py-4 md:p-4 mb-4 shadow-md hover:shadow-lg transition 
                ${status === "Completed" ? "opacity-50" : ""}`}
        >
            {/* Top Right: Action Icons */}
            <div className="absolute top-3 right-3 flex items-center gap-3">
                {
                    <>
                        {
                            status !== "Completed" && (
                                <CirclePlus
                                    size={20}
                                    className="text-yellow-400 cursor-pointer hover:scale-110 transition"
                                    onClick={() => onAddSubtask(task._id)}
                                />
                            )
                        }

                        {
                            subTasks.length > 0 ? (
                                ""
                            )
                            :
                            (
                                loadingComplete ? (
                                    <Loader2 size={20} className="animate-spin" />
                                )
                                :
                                status !== "Completed" ? (
                                    <CircleAlert
                                        size={20}
                                        className="text-orange-400 cursor-pointer hover:scale-110 transition"
                                        onClick={handleComplete}
                                    />
                                )
                                :
                                (
                                    <CheckCircle
                                        size={20}
                                        className="text-green-500"
                                    />
                                )        
                            )
                        }
                        {
                            loadingDelete ? (
                                <Loader2 size={20} className="animate-spin" />
                            )
                            :
                            (
                                <Trash2
                                    size={20}
                                    className={`text-red-500 hover:scale-110 transition ${status === "Completed" ? "cursor-pointer" : "cursor-not-allowed"}`}
                                    onClick={handleDelete}
                                />
                            )
                        }
                    </>
                    
                }
            </div>

            {/* Title */}
            <h3 className={`mt-4 text-white before:content-['🔥']  text-lg font-semibold ${status === "Completed" ? "line-through" : ""}`}>
                {title}
            </h3>

            {/* Priority & Status */}
            <div className="mt-2 text-white/80 text-sm flex justify-between">
                <h3>
                    Status:
                    <span className={`px-3 py-1 ml-2 rounded-full text-[12px] font-semibold ${status === "Completed" ? 
                        "bg-green-600 text-white" : status === "In-progress" ? "bg-yellow-500 text-black" : "bg-gray-500 text-white"}`}
                    >
                        {status}
                    </span>
                </h3>
                <span>
                    Priority: {priority}
                </span>
            </div>

            {/* Created & Due */}
            <div className="mt-2 text-white/50 text-xs flex justify-between">
                <span>Created at: {dateFormatter(createdAt)}</span>
                <span className={`${status === "Completed" ? "hidden" : "block"}`}>
                    {dateRemaining(dueDate)}
                </span>
            </div>

            {/* Subtasks */}
            {
                subTasks.length > 0 && (
                    <div className="mt-3">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex items-center justify-between w-full text-white font-medium px-3 py-1 bg-white/10 rounded-lg"
                        >
                            Subtasks ({subTasks.length})
                            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>

                        {
                            isOpen && (
                                <ul className="mt-2 ml-2">
                                    {
                                        subTasks.map((sub, idx) => (
                                            <li
                                                key={idx}
                                                className="flex justify-between items-center px-1 md:px-2 py-1 bg-white/5 rounded-lg mb-1 text-white/90"
                                            >
                                                <span className={`px-1 before:content-['🚀'] befor:mr-1 md:before:mr-2 ${sub.isCompleted ? "line-through" : ""}`}>
                                                    {sub.title}
                                                </span>
                                                {
                                                    completeSubtask[sub._id] ? (
                                                        <Loader2 size={16} className="animate-spin" />
                                                    )
                                                    :
                                                    sub.isCompleted ? (
                                                        <CheckCircle className="text-green-500" size={16} />
                                                    )
                                                    :
                                                    (
                                                        <CircleAlert
                                                            size={16} 
                                                            className="text-orange-300 cursor-pointer hover:scale-110 transition"
                                                            onClick={() => handleCompleteSubtask(sub._id)}
                                                        />
                                                    )
                                                }
                                            </li>
                                        ))
                                    }
                                </ul>
                            )
                        }
                    </div>
                )
            }
        </div>
    )
}

export default TaskCard;
