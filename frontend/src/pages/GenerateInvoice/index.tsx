import WorkerDashboardHeader from "../../components/workerDashboardHeader";
import Invoices from "../../components/Invoices/invoices";

const GenerateInvoicePage = () =>{
    return(
        <div>
            <WorkerDashboardHeader link_id={2}/>
            <Invoices/>
        </div>
        

    );
};


export default GenerateInvoicePage;