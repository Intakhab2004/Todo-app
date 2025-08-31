import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../../zodSchemas/signupSchema";
import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../services/apis"
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";



const SignUpPage = () => {

    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();

    const {handleSubmit, register, formState: {errors}} = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    })

    const submitHandler = async(data) => {
        setLoader(true);
        try{
            const result = await axios.post(auth.SIGNUP_API, data);

            if(result.data.success){
                console.log("Account created successfully");
                const toastId = toast(
                    "Account created successfully",
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
                navigate(`/verify-code/${data.email}`);
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
        <div className="relative flex flex-col items-center justify-center min-h-screen text-center bg-gradient-to-br from-black via-gray-900 to-blue-950 text-white overflow-hidden px-3 md:px-6">

            <div className="absolute top-0 left-0 w-72 h-72 bg-red-700 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-700 rounded-full blur-3xl opacity-30 animate-ping"></div>

            {/* Sign Up Container */}
            <div className="max-w-md w-full relative z-10 fade-in mt-10 p-5 md:p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-6 md:mb-10 text-white">
                    Create Your <span className="text-red-500">Account</span>
                </h2>

                {/* Signup form */}
                <form onSubmit={handleSubmit(submitHandler)} className="space-y-3 md:space-y-6">
                    <label className="block text-left mb-1 ml-1 text-white/90">Username</label>
                    <input
                        type="text"
                        placeholder="Enter Username"
                        {...register("username")}
                        className="w-full px-4 py-2 rounded-lg border border-gray-500 bg-gradient-to-r from-black/70 to-gray-700 text-white"
                    />
                    {errors.username && <p className="text-red-500 text-sm -mt-3 md:-mt-6 text-left">{errors.username.message}</p>}

                    <label className="block text-left mb-1 ml-1 text-white/90">Email</label>
                    <input
                        type="text"
                        placeholder="Enter email"
                        {...register("email")}
                        className="w-full px-4 py-2 rounded-lg border border-gray-500 bg-gradient-to-r from-black/70 to-gray-700 text-white"
                    />
                    {errors.email && <p className="text-red-500 text-sm -mt-3 md:-mt-6 text-left">{errors.email.message}</p>}

                    <div className="flex flex-col md:flex-row gap-3 md:gap-2">
                        <div>
                            <label className="block text-left mb-1 ml-1 text-white/90">Password</label>
                            <input
                                type="password"
                                placeholder="Enter Password"
                                {...register("password")}
                                className="w-full px-4 py-2 rounded-lg border border-gray-500 bg-gradient-to-r from-black/70 to-gray-700 text-white"
                            />
                            {errors.password && <p className="text-red-500 text-sm text-left">{errors.password.message}</p>}
                        </div>

                        <div>
                            <label className="block text-left mb-1 ml-1 text-white/90">Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Confirm password"
                                {...register("confirmPassword")}
                                className="w-full px-4 py-2 rounded-lg border border-gray-500 bg-gradient-to-r from-black/70 to-gray-700 text-white"
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-sm text-left">{errors.confirmPassword.message}</p>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loader}
                        className="w-fit md:w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg 
                            transition-transform hover:scale-105 cursor-pointer"
                    >
                        {
                            loader ? (
                                        <div className="flex items-center justify-center">
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin"/>  Please wait
                                        </div>
                                        ) : 
                                        ("Submit")
                        }
                    </button>

                </form>
                
                <div className="text-center mt-6 mb-4">
                    <p>
                        Already a member?{' '}
                        <Link to="/sign-in" className="text-blue-600 hover:text-blue-800">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUpPage;