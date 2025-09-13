import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; 
import JobSeekerService from "../services/jobSeekerService"; // JobSeekerService
import ResumeService from "../services/resumeService"; // ResumeService
import PhotoService from "../services/photoService";
import "../assets/styles/JobSeekerDetails.css"; // CSS dosyasını dahil edin

export default function JobSeekerDetails() {
  const [jobSeeker, setJobSeeker] = useState(null);
  const [resume, setResume] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const auth = useSelector((state) => state.auth?.data);
  const token = auth?.token;

  const navigate = useNavigate();

  useEffect(() => {
    if (auth && token) {
      const { userId } = auth.user;

      // JobSeeker verilerini alıyoruz
      JobSeekerService.getJobSeekerByUserId(userId)
        .then((response) => {
          const jobSeekerData = response.data.data;
          setJobSeeker(jobSeekerData);

          // JobSeeker'dan id'yi alıp Resume verilerini alıyoruz
          if (jobSeekerData?.id) {
            console.log("das",jobSeekerData)
            ResumeService.getResumeByJobSeekerId(jobSeekerData.id)  // Burada id kullanıyoruz
              .then((res) => {
                console.log(res.data.data)
                setResume(res.data.data);  // Veriyi doğrudan set ediyoruz
              })
              .catch((error) => {
                console.error("Resume verisi alınamadı:", error);
              });
          }
        })
        .catch((error) => console.error("Job Seeker bilgileri alınamadı:", error));
    }
  }, [auth, token]);

const handlePhotoUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  setUploadingPhoto(true);
  const formData = new FormData();
  formData.append("file", file);

  // Fotoğraf varsa güncelle
  if (resume && resume.photo && resume.photo.id) {
    PhotoService.updatePhoto(resume.photo.id, formData)
      .then((response) => {
        const updatedPhoto = response.data.data;
        return ResumeService.updatePhotoId(resume.id, updatedPhoto.id);
      })
      .then((res) => {
        setResume(res.data.data);
        alert("Fotoğraf başarıyla güncellendi!");
        navigate("/home");
      })
      .catch((error) => {
        console.error("Fotoğraf güncellenirken hata oluştu:", error);
        alert("Fotoğraf güncellenirken hata oluştu.");
      })
      .finally(() => setUploadingPhoto(false));

  } else {
    // Fotoğraf yoksa ekle
    PhotoService.add(formData)
  .then((response) => {
    const newPhoto = response.data.data;
    return ResumeService.updatePhotoId(resume.resumeId, newPhoto.id);
  })
  .then((res) => {
    setResume(res.data.data);
    alert("Fotoğraf başarıyla yüklendi!");
    navigate("/home");
  })
  .catch((error) => {
    console.error("Fotoğraf yüklenirken hata oluştu:", error);
    alert("Fotoğraf yüklenirken hata oluştu.");
  })
  .finally(() => setUploadingPhoto(false));
  }
};






  const photoUrl = resume?.photo?.photoUrl
    ? ResumeService.getUserPhotoUrl(resume.photo.photoUrl)
    : null

  return (
    <div className="job-seeker-detail">
      <div className="job-seeker-container">
        <div className="image-section">
          <label htmlFor="photo-upload">
            <img
              src={photoUrl || "/path/to/default-image.jpg"}
              alt="Job Seeker"
              className="job-seeker-photo"
            />
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ display: "none" }}
            disabled={uploadingPhoto}
          />
        </div>
        <div className="details-section">
          <h2>{jobSeeker?.firstName} {jobSeeker?.lastName}</h2>
          <p>
            <strong>Telefon:</strong> {resume?.phone || "Bilgi Yok"}
          </p>
          <p>
            <strong>Email:</strong> {jobSeeker?.user?.email || "Bilgi Yok"}
          </p>
          <p>
            <strong>Özet:</strong> {resume?.summary || "Bilgi Yok"}
          </p>
          <p>
            <strong>Adres:</strong> {resume?.adress || "Bilgi Yok"}
          </p>
          <p>
            <strong>Doğum Tarihi:</strong> {resume?.birthDate || "Bilgi Yok"}
          </p>
          <p>
            <strong>LinkedIn:</strong> {resume?.linkedinAddress?.linkedinUrl || "Bilgi Yok"}
          </p>
          <p>
            <strong>GitHub:</strong> {resume?.githubAddress?.githubUrl || "Bilgi Yok"}
          </p>
        </div>
      </div>
      <div className="button-container">
        <button className="update-button"
        onClick={() => navigate("/updatejobseekerinfos")}
        >Bilgileri Güncelle</button>
        <button 
          className="change-password-button"
          onClick={() => navigate("/changepasswordforjobseeker")}
        >Şifre Değiştir</button>
      </div>
    </div>
  );
}
