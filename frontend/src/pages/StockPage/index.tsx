import StockTable from "../../components/stock"; 
import AdminDashboardHeader from "../../components/adminDashboardHeader";
import { Grid } from "@mantine/core";

const StockPage = () =>{
    return(
       <div>
        <Grid>
        <Grid.Col span="content">
         <AdminDashboardHeader link_id = {2}/>
         </Grid.Col>


        

         <Grid.Col span={"auto"}>
         <StockTable/>
         </Grid.Col>

         </Grid>

       </div>
    )
}

export default StockPage;