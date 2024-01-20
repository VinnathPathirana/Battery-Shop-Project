import axios from "axios";

const BASE_URL = "http://localhost:3001";

class AdminAPI {

    static login (values : {emailOrNic : string, password : string}) {
        
        return axios.post(`${BASE_URL}/admin/login`,values,{withCredentials:true});
    }

    static logout(){
        return axios.get(`${BASE_URL}/worker/logout`,{withCredentials:true});
    }

    static workerRegister (values : {name : string, email : string,password : string, phone : string,nic:string,address:string,gender:string}) {
        console.log(values);
        return axios.post(`${BASE_URL}/worker/register`,values,{withCredentials:true});
    }
    
};

export default AdminAPI;