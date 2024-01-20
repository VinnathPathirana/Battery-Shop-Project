import { Navigate } from "react-router-dom";
import WorkerAPI from "../../API/workerAPI/worker.api";
import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import AdminAPI from "../../API/adminAPI/admin.api";

const logout = async () => {
  // remove the local storage data in current user
  localStorage.removeItem("user-worker-session");

  // clear the accessToken
  WorkerAPI.logout().then((res) => {
    // navigate to the landing page
    window.location.href = 'http://localhost:3000/';
    
  }).catch((error)=>{
    showNotification({
        title : "Logout error",
        message : "Error while logouting",
        icon : <IconX/>,
        color : "red",
        autoClose:1500
    });
  });

  
};

const Logout = () => {
  logout();

  return <div />;
};
export default Logout;
