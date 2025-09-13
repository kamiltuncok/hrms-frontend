
import axios from "axios"

export default class GithubAdressService{
    getGithubAdress(){
        return axios.get("http://localhost:8080/api/githubadresses/getall");
    }

    add(githubAdress){
        return axios.post("http://localhost:8080/api/githubadresses/add",githubAdress);
    }
}