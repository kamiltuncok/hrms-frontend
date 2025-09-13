import axios from "axios";

export default class ResumeService {


    static getResumeByJobSeekerId(jobSeekerId) {
        return axios.get(`http://localhost:8080/api/resumes/getResumeByJobSeekerId/${jobSeekerId}`);
      }

    // Fotoğraf URL'sini alacak metod
    static getUserPhotoUrl(photoUrl) {
        if (photoUrl) {
            return `http://localhost:8080/uploads/${photoUrl}`; // Gerçek URL
        }
        return "https://via.placeholder.com/150"; // Fotoğraf yoksa placeholder
    }

    static updateGithubUrl(resumeId, githubUrl) {
        return axios.put(`http://localhost:8080/api/resumes/updateGithubUrl/${resumeId}`, {
            githubUrl: githubUrl
        });
    }

    // Update LinkedIn URL
    static updateLinkedinUrl(resumeId, linkedinUrl) {
        return axios.put(`http://localhost:8080/api/resumes/updateLinkedinUrl/${resumeId}`, {
            linkedinUrl: linkedinUrl
        });
    }

    static updatePhotoId(resumeId, photoId) {
    return axios.put(`http://localhost:8080/api/resumes/updatePhotoId`, null, {
      params: { resumeId: resumeId, photoId: photoId },
    });
  }
  
}
