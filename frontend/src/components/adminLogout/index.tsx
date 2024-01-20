import { Navigate } from "react-router-dom";
import AdminAPI from "../../API/adminAPI/admin.api";
import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";

const adminlogout = async () => {
  // remove the local storage data in current user
  localStorage.removeItem("user-worker-session");

  // clear the accessToken
  AdminAPI.logout().then((res) => {
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

const Adminlogout = () => {
    adminlogout();

  return <div />;
};
export default Adminlogout;
