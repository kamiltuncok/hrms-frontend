import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmployerService from "../services/employerService"; // EmployerService
import UserService from "../services/userService"; // UserService
import { useSelector } from "react-redux";
import "../assets/styles/UpdateInfos.css"; // CSS dosyasını dahil edin
import { toast, ToastContainer } from 'react-toastify'; // Import toast

export default function UpdateEmployerInfos() {
  const [employerId, setEmployerId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const [section1Open, setSection1Open] = useState(false);
  const [section2Open, setSection2Open] = useState(false);
  const [section3Open, setSection3Open] = useState(false);
  const [section4Open, setSection4Open] = useState(false);

  // Web adresi, telefon numarası, şirket ismi ve email state'leri
  const [webAddress, setWebAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");

  const auth = useSelector((state) => state.auth?.data);
  const token = auth?.token;
  const navigate = useNavigate(); // useNavigate hook'unu ekleyin

  // Kullanıcı bilgisi alınıyor ve employerId elde ediliyor
  useEffect(() => {
    if (auth && token) {
      const { userId } = auth.user;

      // Employer verilerini alıyoruz
      EmployerService.getEmployerByUserId(userId)
        .then((response) => {
          const employerData = response.data.data;
          setEmployerId(employerData?.id); // employerId'yi alıyoruz

          // Web adresi, telefon numarası, şirket ismi ve email'i state'e alıyoruz
          setWebAddress(employerData?.webAddress || "");
          setPhoneNumber(employerData?.phoneNumber || "");
          setCompanyName(employerData?.companyName || "");
          setEmail(employerData?.email || ""); // Email'i de state'e alıyoruz
        })
        .catch((error) => console.error("Employer bilgileri alınamadı:", error));
    }
  }, [auth, token]);

  // Bölüm açma işlevi
  const toggleSection = (section) => {
    if (section === 1) setSection1Open(!section1Open);
    if (section === 2) setSection2Open(!section2Open);
    if (section === 3) setSection3Open(!section3Open);
    if (section === 4) setSection4Open(!section4Open);
  };

  // Web adresi güncelleme işlemi
  const handleUpdateWebAddress = () => {
    EmployerService.updateWebAddress(employerId, webAddress)
      .then((response) => {
        toast.success("Web adresi başarıyla güncellendi.", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });

        setTimeout(() => {
          navigate("/home"); // Web adresi güncellendikten sonra home sayfasına yönlendir
        }, 2000);
      })
      .catch((error) => {
        toast.error("Web adresi güncellenirken hata oluştu.", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      });
  };

  // Telefon numarası güncelleme işlemi
  const handleUpdatePhoneNumber = () => {
    EmployerService.updatePhoneNumber(employerId, phoneNumber)
      .then((response) => {
        toast.success("Telefon numarası başarıyla güncellendi.", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });

        setTimeout(() => {
          navigate("/home"); // Telefon numarası güncellendikten sonra home sayfasına yönlendir
        }, 2000);
      })
      .catch((error) => {
        toast.error("Telefon numarası güncellenirken hata oluştu.", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      });
  };

  // Şirket ismi güncelleme işlemi
  const handleUpdateCompanyName = () => {
    EmployerService.updateCompanyName(employerId, companyName)
      .then((response) => {
        toast.success("Şirket ismi başarıyla güncellendi.", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });

        setTimeout(() => {
          navigate("/home"); // Şirket ismi güncellendikten sonra home sayfasına yönlendir
        }, 2000);
      })
      .catch((error) => {
        toast.error("Şirket ismi güncellenirken hata oluştu.", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      });
  };

  // Email güncelleme işlemi (mevcut kodu kullanarak)
  const handleUpdateEmail = () => {
    UserService.updateEmail(auth.user.userId, email)
      .then((response) => {
        toast.success("Email başarıyla güncellendi.", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });

        setTimeout(() => {
          navigate("/home"); // Email güncellenme işlemi sonrası yönlendirme
        }, 2000);
      })
      .catch((error) => {
        toast.error("Email güncellenirken hata oluştu.", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      });
  };

  return (
    <div className="update-container">
        <ToastContainer />
      <h2>İşveren Bilgilerini Güncelle</h2>

      {successMessage && <p className="success-message">{successMessage}</p>} {/* Success message display */}

      {/* 1. Bölüm: Web Adresi Güncelle */}
      <div className="section">
        <div className="section-header" onClick={() => toggleSection(1)}>
          <span className="section-title">1. Web Adresi Güncelle</span>
          <button className="expand-button">{section1Open ? '-' : '+'}</button>
        </div>
        {section1Open && (
          <div className="section-content">
            <div className="input-group">
              <label htmlFor="webAddress">Web Adresi:</label>
              <input
                type="text"
                id="webAddress"
                value={webAddress}
                onChange={(e) => setWebAddress(e.target.value)}
              />
            </div>
            <button onClick={handleUpdateWebAddress}>Web Adresi Güncelle</button>
          </div>
        )}
      </div>

      {/* 2. Bölüm: Telefon Numarası Güncelle */}
      <div className="section">
        <div className="section-header" onClick={() => toggleSection(2)}>
          <span className="section-title">2. Telefon Numarası Güncelle</span>
          <button className="expand-button">{section2Open ? '-' : '+'}</button>
        </div>
        {section2Open && (
          <div className="section-content">
            <div className="input-group">
              <label htmlFor="phoneNumber">Telefon Numarası:</label>
              <input
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <button onClick={handleUpdatePhoneNumber}>Telefon Numarası Güncelle</button>
          </div>
        )}
      </div>

      {/* 3. Bölüm: Şirket İsmi Güncelle */}
      <div className="section">
        <div className="section-header" onClick={() => toggleSection(3)}>
          <span className="section-title">3. Şirket İsmi Güncelle</span>
          <button className="expand-button">{section3Open ? '-' : '+'}</button>
        </div>
        {section3Open && (
          <div className="section-content">
            <div className="input-group">
              <label htmlFor="companyName">Şirket İsmi:</label>
              <input
                type="text"
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <button onClick={handleUpdateCompanyName}>Şirket İsmini Güncelle</button>
          </div>
        )}
      </div>

      {/* 4. Bölüm: Email Güncelle */}
      <div className="section">
        <div className="section-header" onClick={() => toggleSection(4)}>
          <span className="section-title">4. Email Güncelle</span>
          <button className="expand-button">{section4Open ? '-' : '+'}</button>
        </div>
        {section4Open && (
          <div className="section-content">
            <div className="input-group">
              <label htmlFor="email">Yeni Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                placeholder="Yeni email adresinizi girin"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button onClick={handleUpdateEmail}>Email Güncelle</button>
          </div>
        )}
      </div>
    </div>
  );
}
