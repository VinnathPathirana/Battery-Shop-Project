import React from "react";
import { Grid } from "@mantine/core";
import StatsProfitCard from "../ProfitCard";
import AdminDashboardHeader from "../adminDashboardHeader";

function profitBoard() {
  return (
    <div>
      <Grid>
        <Grid.Col span={4}>
          <center><h1>Battry Shop Stocks</h1></center>
          <StatsProfitCard/>
        </Grid.Col>

        <Grid.Col span={4}>
        <center><h1>PROFIT OF THE DAY</h1></center>
        <StatsProfitCard/>
        </Grid.Col>
      </Grid>
    </div>
  );
}

export default profitBoard;
