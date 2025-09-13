
import axios from "axios"

export default class LinkedinAddressService{
    getLinkedinAddress(){
        return axios.get("http://localhost:8080/api/linkedinaddresses/getall");
    }

    add(linkedinaddress){
        return axios.post("http://localhost:8080/api/linkedinaddresses/add",linkedinaddress);
    }
}