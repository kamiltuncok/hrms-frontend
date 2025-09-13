import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // useNavigate import edin
import EmployerService from "../services/employerService";
import "../assets/styles/EmployerDetails.css";

export default function EmployerDetails() {
  const [employer, setEmployer] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const auth = useSelector((state) => state.auth?.data);
  const token = auth?.token;

  const navigate = useNavigate(); // useNavigate hook'unu kullanarak yönlendirme işlevini oluştur

  useEffect(() => {
    if (auth && token) {
      const { userId } = auth.user;

      EmployerService.getEmployerByUserId(userId)
        .then((response) => {
          const employerData = response.data.data;
          setEmployer(employerData);
        })
        .catch((error) => console.error("Employer bilgileri alınamadı:", error));
    }
  }, [auth, token]);

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];

    if (file && employer?.id) {
      setUploadingPhoto(true);

      const formData = new FormData();
      formData.append("file", file);

      EmployerService.updatePhoto(employer.id, formData)
        .then((response) => {
          setEmployer((prev) => ({
            ...prev,
            photoUrl: response.data.data.photoUrl || prev.photoUrl,
          }));
          alert("Fotoğraf başarıyla güncellendi!");
          
          // Fotoğraf güncellendikten sonra /home sayfasına yönlendirme
          navigate("/home");
        })
        .catch((error) => {
          console.error("Fotoğraf güncellenirken hata oluştu:", error);
          alert("Fotoğraf güncellenirken hata oluştu.");
        })
        .finally(() => {
          setUploadingPhoto(false);
        });
    }
  };

  if (!employer) {
    return <div>Yükleniyor...</div>;
  }

  const photoUrl = employer?.photoUrl
    ? EmployerService.getEmployerPhotoUrl(employer.photoUrl)
    : null;

  return (
    <div className="employer-detail">
      <div className="employer-container">
        <div className="image-section">
          <label htmlFor="photo-upload">
            <img
              src={photoUrl || "/path/to/default-image.jpg"}
              alt="Employer"
              className="employer-photo"
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
          <h2>{employer?.companyName || "Bilgi Yok"}</h2>
          <p>
            <strong>Şirket Adı:</strong> {employer?.companyName || "Bilgi Yok"}
          </p>
          <p>
            <strong>Telefon:</strong> {employer?.phoneNumber || "Bilgi Yok"}
          </p>
          <p>
            <strong>Web Site:</strong> {employer?.webAdress || "Bilgi Yok"}
          </p>
          <p>
            <strong>Email:</strong> {employer?.user?.email || "Bilgi Yok"}
          </p>
        </div>
      </div>
      <div className="button-container">
        <button className="update-button"
        onClick={() => navigate("/updateemployerinfos")}
        >Bilgileri Güncelle</button>
        <button 
          className="change-password-button"
          onClick={() => navigate("/changepasswordforemployer")}
        >Şifre Değiştir</button>
      </div>
    </div>
  );
}
