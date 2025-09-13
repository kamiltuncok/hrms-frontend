
import axios from "axios"

export default class WorkModelService{
    getWorkModels(){
        return axios.get("http://localhost:8080/api/workmodels/getall");
    }

    add(workmodel){
        return axios.post("http://localhost:8080/api/workmodels/add",workmodel);
    }
}