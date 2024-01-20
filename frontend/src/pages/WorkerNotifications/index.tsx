import WorkerDashboardHeader from "../../components/workerDashboardHeader";
import PendingStocks from "../../components/stocksPending";

const WorkerNotifications = () => {
    return (

        <div>
            <WorkerDashboardHeader link_id={1} />
            <PendingStocks/>
        </div>
    )
}

export default WorkerNotifications;