
import axios from "axios"

export default class JobAdvertisementService{
    getJobAdvertisement(){
        return axios.get("http://localhost:8080/api/jobadvertisements/getall");
    }

    add(jobAdvertisement){
        return axios.post("http://localhost:8080/api/jobadvertisements/add",jobAdvertisement);
    }
    
    getActiveJobadvertisement(){
        return axios.get("http://localhost:8080/api/jobadvertisements/getactivejobadvertisement");
    }

    getActiveJobAdvertisementByCompany(companyName){
        return axios.get("http://localhost:8080/api/jobadvertisements/getactivejobadvertisementbycompany?companyName="+companyName);
    }

    getJobAdvertisementByDate(){
        return axios.get("http://localhost:8080/api/jobadvertisements/getactivejobadvertisementbydate");
    }

    updateJobAdvertisementStatusById(jobAdvertisementId){
        return axios.post("http://localhost:8080/api/jobadvertisements/updatejobadvertisementstatusbyid?jobAdvertisementId="+jobAdvertisementId);
    }

    getJobAdvertisementById(jobAdvertisementId){
        return axios.get("http://localhost:8080/api/jobadvertisements/getjobadvertisementbyid?jobAdvertisementId="+jobAdvertisementId);
    }

    getJobAdvertisementsByCity(cityId) {
        return axios.get(`http://localhost:8080/api/jobadvertisements/city/${cityId}`);
      }

      getJobAdvertisementsByWorkModel(workModelId) {
    return axios.get(`http://localhost:8080/api/jobadvertisements/workmodel/${workModelId}`);
}

    getJobAdvertisementsByTypeOfWork(typeOfWorkId) {
    return axios.get(`http://localhost:8080/api/jobadvertisements/typeofwork/${typeOfWorkId}`);
}

    getThreeJobAdvertisements() {
        return axios.get("http://localhost:8080/api/jobadvertisements/getThreejobadvertisements");
      }

      getJobAdvertisementsByJobTitleId(jobTitleId) {
    return axios.get(`http://localhost:8080/api/jobadvertisements/jobtitle/${jobTitleId}`);
     }


}