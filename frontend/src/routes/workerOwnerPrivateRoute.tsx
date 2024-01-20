import { Navigate, Outlet } from "react-router-dom";

const WorkerOwnerPrivateRoute = () =>{
    const user = JSON.parse(localStorage.getItem("user-worker-session")!!);

    return user ? <Outlet/> : <Navigate to={'/login/worker'}/>
}

export default WorkerOwnerPrivateRoute;