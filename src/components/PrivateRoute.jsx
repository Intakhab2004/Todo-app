import { Navigate, Outlet } from "react-router-dom";


function PrivateRoute({children}){
    const token = JSON.parse(localStorage.getItem("token"));

    if(!token){
        return <Navigate to={"/sign-in"} />
    }

    else{
        return children;
    }
}

export default PrivateRoute;