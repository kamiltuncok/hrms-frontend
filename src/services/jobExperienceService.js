
import axios from "axios"

export default class JobExperienceService{
    getJobExperiences(){
        return axios.get("http://localhost:8080/api/jobexperinces/getall");
    }

    add(jobexperience){
        return axios.post("http://localhost:8080/api/jobexperinces/add",jobexperience);
    }

    getAllByEmployeeIdDateOfEnd(employeeId){
        return axios.get("http://localhost:8080/api/jobexperinces/getallbyemployeeiddateofend?employeeId="+employeeId);
    }

    getAllByEmployeeIdDateOfEndDesc(direction, employeeId){
        return axios.get(`http://localhost:8080/api/jobexperiences/getallbyemployeeiddateofenddesc?direction=${direction}&employeeId=${employeeId}`);
    }

    
}