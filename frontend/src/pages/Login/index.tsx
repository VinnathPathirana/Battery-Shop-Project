import { Group } from "@mantine/core";
import WorkerLogin from "../../components/workerLogin";
import AdminLogin from "../../components/adminLogin";
import backgroundimg from "../../assets/backgroundimg.jpg"
import { forwardRef } from "react";

const LoginPage = forwardRef<HTMLInputElement>((props,ref) => {

  return (
    <div style={{ height: "100vh" , backgroundImage:`url(${backgroundimg})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center'  }} ref={ref}>
      <Group position="center"  spacing={100}  >
          <AdminLogin />
          <WorkerLogin />
      </Group>
    </div>
  );
});

export default LoginPage;
