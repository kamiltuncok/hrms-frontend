import axios from "axios"

export default class CandidateService{
    getCandidates(){
        return axios.get("http://localhost:8080/api/candidates/getall");
    }

    add(candidate){
        return axios.post("http://localhost:8080/api/candidates/save",candidate);
    }
}