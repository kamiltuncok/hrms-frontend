
import axios from "axios"

export default class SchoolService{
    getSchools(){
        return axios.get("http://localhost:8080/api/schools/getall");
    }

    add(school){
        return axios.post("http://localhost:8080/api/schools/add",school);
    }

    getAllByEmployeeIdGraduateDate(employeeId){
        return axios.get("http://localhost:8080/api/schools/getallbyemployeeidgraduatedate?employeeId="+employeeId);
    }

    getAllByEmployeeIdGraduateDateDesc(direction, employeeId){
        return axios.get(`http://localhost:8080/api/schools/getallbyemployeeidgraduatedatedesc?direction=${direction}&employeeId=${employeeId}`);
    }
}