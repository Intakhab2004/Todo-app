import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import TaskList from "../tasks/TaskList";
import { useContext, useEffect, useState } from "react";
import { TaskContext } from "../../context/taskContext";

const Dashboard = () => {

    const {taskList, getTask} = useContext(TaskContext);


    useEffect(() => {
        getTask();
    }, [])

    const completedTask = taskList.filter((task) => task.status === "Completed").length;
    const inProgressTask = taskList.filter((task) => task.status === "In-progress").length;
    const pendingTask = taskList.filter((task) => task.status === "Pending").length;


    return (
        <section className="md:col-span-3 space-y-6">
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:pb-0">
                <div className="min-w-[250px] snap-center bg-gradient-to-r from-red-600/60 to-red-800/60 p-5 rounded-xl shadow-lg flex items-center justify-between transform transition hover:scale-105">
                    <div>
                        <p className="text-sm text-gray-200">Pending</p>
                        <h3 className="text-2xl font-bold">{pendingTask}</h3>
                    </div>
                    <Clock size={32} />
                </div>

                <div className="min-w-[250px] snap-center bg-gradient-to-r from-yellow-600/60 to-yellow-800/60 p-5 rounded-xl shadow-lg flex items-center justify-between transform transition hover:scale-105">
                    <div>
                        <p className="text-sm text-gray-200">In-progress</p>
                        <h3 className="text-2xl font-bold">{inProgressTask}</h3>
                    </div>
                    <AlertTriangle size={32} />
                </div>

                <div className="min-w-[250px] snap-center bg-gradient-to-r from-green-600/60 to-green-800/60 p-5 rounded-xl shadow-lg flex items-center justify-between transform transition hover:scale-105">
                    <div>
                        <p className="text-sm text-gray-200">Completed</p>
                        <h3 className="text-2xl font-bold">{completedTask}</h3>
                    </div>
                    <CheckCircle2 size={32} />
                </div>
            </div>

            {/* Task List */}
            <TaskList />
        </section>
    )

}

export default Dashboard;
