
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import AdminLoginPage from "../pages/Login/adminLogin";
import WorkerLoginPage from "../pages/Login/workerLogin";
import WorkerOwnerPrivateRoute from "./workerOwnerPrivateRoute";
import WorkerDashboard from "../pages/WorkerDashboard";
import Logout from "../components/logout/logout";
import Adminlogout from "../components/adminLogout";
import WorkerNotifications from "../pages/WorkerNotifications";
import StockTable from "../components/stock";
import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
import GenerateInvoicePage from "../pages/GenerateInvoice";
import ManageWorkerPage from "../pages/ManageWorker";
import ProfitPage from "../pages/ProfitPage";
import StockPage from "../pages/StockPage";
import DeletedStockPage from "../pages/DeletedPage";
import Error404 from "../pages/Error404";


const AllRoutes = () => {
  const client = new QueryClient();//config query client
  return (
    <div>
    <QueryClientProvider client={client}>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login/admin" element={<AdminLoginPage />} />
        <Route path="/login/worker" element={<WorkerLoginPage />} />

        <Route path="/admin/logout" element={<Adminlogout />} />

        <Route path="/admin/manageworker" element={<ManageWorkerPage/>} />
        <Route path="/admin/profitpage" element={<ProfitPage/>} />
        <Route path="/admin/stockpage" element={<StockPage/>} />

        <Route path = '/admin/deletedtable' element={<DeletedStockPage/>} />


        
        
        <Route path="/worker" element={<WorkerOwnerPrivateRoute />}>
          <Route path="/worker/managestock" element={<WorkerDashboard />} />
          <Route
            path="/worker/notifications"
            element={<WorkerNotifications />}
          />
          <Route path="/worker/invoice" element={<GenerateInvoicePage/>}/>
          <Route path="/worker/logout" element={<Logout />} />
          
        </Route>


        <Route path="*" element={<Error404/>}/>
      </Routes>
    </Router>
    </QueryClientProvider>
    </div>
  );
};

export default AllRoutes;
