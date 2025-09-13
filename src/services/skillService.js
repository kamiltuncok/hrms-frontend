
import axios from "axios"

export default class SkillService{
    getSkills(){
        return axios.get("http://localhost:8080/api/skills/getall");
    }

    add(skill){
        return axios.post("http://localhost:8080/api/skills/add",skill);
    }
}