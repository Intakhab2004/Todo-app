import { Navigate, Outlet } from "react-router-dom";


function PublicRoute(){
    const token = JSON.parse(localStorage.getItem("token"));

    if(!token){
        return <Outlet />
    }
    else{
        return <Navigate to={"/dashboard"} />
    }
}

export default PublicRoute;