import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmployerService from "../services/employerService"; // EmployerService
import { useSelector } from "react-redux";
import "../assets/styles/ChangePassword.css"; // CSS dosyasını dahil edin

export default function ChangePasswordEmployer() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [employerId, setEmployerId] = useState(null);

  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth?.data);
  const token = auth?.token;

  // Kullanıcı bilgisi alınıyor ve employerId elde ediliyor
  useEffect(() => {
    if (auth && token) {
      const { userId } = auth.user;

      // Employer verilerini alıyoruz
      EmployerService.getEmployerByUserId(userId)
        .then((response) => {
          const employerData = response.data.data;
          setEmployerId(employerData?.id); // employerId'yi alıyoruz
        })
        .catch((error) => console.error("Employer bilgileri alınamadı:", error));
    }
  }, [auth, token]);

  // Şifre değişiklik işlemi
  const handleChangePassword = (e) => {
    e.preventDefault();

    if (!employerId) {
      setError("Employer ID alınamadı.");
      return;
    }

    // Şifrelerin eşleşip eşleşmediğini kontrol et
    if (newPassword !== confirmNewPassword) {
      setError("Yeni şifreler eşleşmiyor.");
      return;
    }

    // Şifreyi değiştirmek için EmployerService'i kullan
    setIsLoading(true);
    EmployerService.changePassword(employerId, currentPassword, newPassword)
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
