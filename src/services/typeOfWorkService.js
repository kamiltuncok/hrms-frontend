import axios from "axios"

export default class TypeOfWorkService {
    getTypeOfWorks() {
        return axios.get("http://localhost:8080/api/typeofworks/getall");
    }

    add(typeOfWork) {
        return axios.post("http://localhost:8080/api/typeofworks/add", typeOfWork);
    }
}
