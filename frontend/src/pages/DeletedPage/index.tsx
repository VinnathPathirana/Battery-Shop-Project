import { DeletedTable } from "../../components/deletedStock";
import AdminDashboardHeader from "../../components/adminDashboardHeader";
import { Grid, ScrollArea } from "@mantine/core";

const DeletedStockPage = () => {
  return (
    <div>
      <Grid>
        <Grid.Col span="content">
          <AdminDashboardHeader link_id={3} />
        </Grid.Col>
        <Grid.Col span={"auto"}>
            <DeletedTable />
        </Grid.Col>

      </Grid>

    </div>
  )
}

export default DeletedStockPage;