import axios from "axios";

export default class JobSeekerService {
  // Tüm iş arayanları getirir
  getJobseekers() {
    return axios.get("http://localhost:8080/api/jobseekers/getall");
  }

  // Yeni bir iş arayan ekler
  add(jobSeeker) {
    return axios.post("http://localhost:8080/api/jobseekers/add", jobSeeker);
  }

  // userId'ye göre job seeker bilgilerini getirir
  static getJobSeekerByUserId(userId) {
    return axios.get(`http://localhost:8080/api/jobseekers/getjobseekerbyuserid?userId=${userId}`);
  }

  static changePassword(jobSeekerId, currentPassword, newPassword) {
    return axios.put(
      `http://localhost:8080/api/jobseekers/changepassword/${jobSeekerId}`,
      {
        currentPassword,
        newPassword
      } // Veriyi body olarak gönderiyoruz
    );
  }

  static updateResumeInfo(jobSeekerId, resumeData) {
    return axios.put(
      `http://localhost:8080/api/jobseekers/updateresumeinfos/${jobSeekerId}`,
      resumeData
    );
  }
  
}
