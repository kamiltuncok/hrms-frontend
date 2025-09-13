
import axios from "axios"

export default class UserService{
    getUsers(){
        return axios.get("http://localhost:8080/api/users/getall");
    }

    add(user){
        return axios.post("http://localhost:8080/api/users/add",user);
    }

    addEmployer(employer){
        return axios.post("http://localhost:8080/api/users/add/employer",employer);
    }

    addJobSeeker(jobseeker){
        return axios.post("http://localhost:8080/api/users/add/jobseeker",jobseeker);
    }

    static updateEmail(userId, email) {
        return axios.put(`http://localhost:8080/api/users/update/email/${userId}`, { newEmail: email });
      }
}