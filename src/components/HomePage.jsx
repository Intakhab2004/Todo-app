import img1 from "../assets/img1.jpeg"
import "../App.css"
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen text-center bg-gradient-to-br from-black via-gray-900 to-blue-950 text-white overflow-hidden px-6">

            <div className="absolute top-0 left-0 w-72 h-72 bg-red-700 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-700 rounded-full blur-3xl opacity-30 animate-ping"></div>

            <h1 className="absolute top-6 right-8 text-3xl md:text-4xl font-extrabold tracking-wide text-red-500 drop-shadow-lg">
                <span className="text-white">Task</span>
                <span className="text-red-500">Hunter</span>
            </h1>

            {/* Content */}
            <div className="max-w-3xl relative z-10 fade-in mt-12">
                <h2 className="text-4xl md:text-6xl font-extrabold mb-6 slide-up">
                    Take Control of Your{" "}
                    <span className="text-red-500">Tasks</span>
                </h2>

                <p className="text-base md:text-lg font-semibold mb-10 text-gray-300 italic leading-snug fade-in-delayed">
                    Boost your productivity and stay ahead. <br />
                    Your personal task manager, built to keep you focused and unstoppable. ✨
                </p>

                <div className="flex justify-center gap-8 mb-16 slide-up-delayed">
                    <button
                        onClick={() => navigate("/sign-in")}
                        className="px-8 py-3 bg-red-500 text-white font-bold rounded-full shadow-lg hover:bg-red-600 hover:scale-105 transition-transform duration-300"
                    >
                        Login
                    </button>

                    <button
                        onClick={() => navigate("/sign-up")}
                        className="px-8 py-3 bg-white text-black font-bold rounded-full shadow-lg hover:bg-gray-200 hover:scale-105 transition-transform duration-300"
                    >
                        Sign Up
                    </button>
                </div>

                <div className="flex justify-center">
                    <img
                        src={img1}
                        alt="Todo Illustration"
                        className="w-80 md:w-96 rounded-xl shadow-2xl float-animation"
                    />
                </div>
            </div>
        </div>
    )
}

export default HomePage;
