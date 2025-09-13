import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JobSeekerService from "../services/jobSeekerService"; // JobSeekerService
import { useSelector } from "react-redux";
import "../assets/styles/ChangePassword.css"; // CSS dosyasını dahil edin

export default function ChangePasswordJobSeeker() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [jobSeekerId, setJobSeekerId] = useState(null);

  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth?.data);
  const token = auth?.token;

  // Kullanıcı bilgisi alınıyor ve jobSeekerId elde ediliyor
  useEffect(() => {
    if (auth && token) {
      const { userId } = auth.user;

      // JobSeeker verilerini alıyoruz
      JobSeekerService.getJobSeekerByUserId(userId)
        .then((response) => {
          const jobSeekerData = response.data.data;
          setJobSeekerId(jobSeekerData?.id); // jobSeekerId'yi alıyoruz
        })
        .catch((error) => console.error("Job Seeker bilgileri alınamadı:", error));
    }
  }, [auth, token]);

  // Şifre değişiklik işlemi
  const handleChangePassword = (e) => {
    e.preventDefault();

    if (!jobSeekerId) {
      setError("JobSeeker ID alınamadı.");
      return;
    }

    // Şifrelerin eşleşip eşleşmediğini kontrol et
    if (newPassword !== confirmNewPassword) {
      setError("Yeni şifreler eşleşmiyor.");
      return;
    }

    // Şifreyi değiştirmek için JobSeekerService'i kullan
    setIsLoading(true);
    JobSeekerService.changePassword(jobSeekerId, currentPassword, newPassword)
      .then((response) => {
        setSuccessMessage("Şifre başarıyla değiştirildi.");
        setError("");
        setIsLoading(false);
        setTimeout(() => navigate("/home"), 1000); // 1 saniye sonra anasayfaya yönlendir
      })
      .catch((error) => {
        setError("Şifre değiştirilemedi. Lütfen mevcut şifrenizi kontrol edin.");
        setSuccessMessage("");
        setIsLoading(false);
      });
  };

  return (
    <div className="change-password-container">
      <h2>Şifre Değiştirme</h2>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form onSubmit={handleChangePassword}>
        <div className="form-group">
          <label htmlFor="current-password">Mevcut Şifre</label>
          <input
            type="password"
            id="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="new-password">Yeni Şifre</label>
          <input
            type="password"
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirm-new-password">Yeni Şifre (Tekrar)</label>
          <input
            type="password"
            id="confirm-new-password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? "Yükleniyor..." : "Şifreyi Değiştir"}
        </button>
      </form>
    </div>
  );
}
