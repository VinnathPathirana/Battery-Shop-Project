import axios from "axios";

const BASE_URL = "http://localhost:3001";

class WorkerAPI {
    static login (values : {nic : string, password : string}) {
        return axios.post(`${BASE_URL}/worker/login`,values,{withCredentials:true});
    }

    static logout(){
        return axios.get(`${BASE_URL}/worker/logout`,{withCredentials:true});
    }

    static deleteBattery (batteryId : string){
        return axios.delete(`${BASE_URL}/stock/delete/${batteryId}`,{withCredentials : true});
    }
    
   //get all Worker Details
   static getAllWorkerDetails= () => {
    return axios.get(`${BASE_URL}/worker/getworkers`,{withCredentials:true});

};

static deleteWorker = (values : {_id : string}) => {
    return axios.delete(`${BASE_URL}/worker/delete/${values._id}`,{withCredentials:true});
};

 //update battery details
 static updateWorker = (values: {
    _id: string;
    worker_id :string;
    name: string;
    email: string;
    phone: string;
    nic: string;
    address: string;
    gender: string;
}) => {

    return axios.put(`${BASE_URL}/worker/update/${values._id}`,
        values,
        {withCredentials:true}
    );
};


    
};

export default WorkerAPI;