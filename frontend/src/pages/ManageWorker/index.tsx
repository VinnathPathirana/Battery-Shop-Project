import AdminDashboardHeader from "../../components/adminDashboardHeader";
import ManageWorker from "../../components/ManageWorker";
import { Grid } from "@mantine/core";

const ManageWorkerPage = ()=>{
    return(
        <div>
        <Grid>
        <Grid.Col span="content">
         <AdminDashboardHeader link_id = {0}/>
         </Grid.Col>

         <Grid.Col span={"auto"}>
         <ManageWorker/>
         </Grid.Col>
         </Grid>
         </div>
    )
}

export default ManageWorkerPage;