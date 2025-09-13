import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JobSeekerService from "../services/jobSeekerService"; // JobSeekerService
import UserService from "../services/userService";
import ResumeService from "../services/resumeService";
import { useSelector } from "react-redux";
import "../assets/styles/UpdateInfos.css"; // CSS dosyasını dahil edin
import { toast, ToastContainer } from 'react-toastify'; // Import toast

export default function UpdateJobSeekerInfos() {
  const [jobSeekerId, setJobSeekerId] = useState(null);
  const [resumeId, setResumeId] = useState(null);
  const [section1Open, setSection1Open] = useState(false);
  const [section2Open, setSection2Open] = useState(false);
  const [section3Open, setSection3Open] = useState(false);
  const [section4Open, setSection4Open] = useState(false);

  // Kişisel bilgiler için state'ler
  const [phone, setPhone] = useState("");
  const [summary, setSummary] = useState("");
  const [address, setAddress] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState(""); // Email state'i eklendi
  const [linkedinUrl, setLinkedinUrl] = useState(""); // LinkedIn URL state
  const [githubUrl, setGithubUrl] = useState(""); // GitHub URL state
  const [successMessage, setSuccessMessage] = useState(""); // Success message state

  const auth = useSelector((state) => state.auth?.data);
  const token = auth?.token;
  const navigate = useNavigate(); // useNavigate hook'unu ekleyin

  // Kullanıcı bilgisi alınıyor ve jobSeekerId elde ediliyor
  useEffect(() => {
    if (auth && token) {
      const { userId } = auth.user;

      // JobSeeker verilerini alıyoruz
      JobSeekerService.getJobSeekerByUserId(userId)
        .then((response) => {
          const jobSeekerData = response.data.data;
          setJobSeekerId(jobSeekerData?.id); // jobSeekerId'yi alıyoruz
          setResumeId(jobSeekerData?.resumeId);
          
          // Kişisel bilgileri state'e alıyoruz
          setPhone(jobSeekerData?.phone || "");
          setSummary(jobSeekerData?.summary || "");
          setAddress(jobSeekerData?.address || "");
          setBirthDate(jobSeekerData?.birthDate || "");
          setEmail(jobSeekerData?.email || ""); // Email'i de state'e alıyoruz
        })
        .catch((error) => console.error("Job Seeker bilgileri alınamadı:", error));
    }
  }, [auth, token]);

  // Bölüm açma işlevi
  const toggleSection = (section) => {
    if (section === 1) setSection1Open(!section1Open);
    if (section === 2) setSection2Open(!section2Open);
    if (section === 3) setSection3Open(!section3Open);
    if (section === 4) setSection4Open(!section4Open);
  };

  // API ile kişisel bilgileri güncelleme işlemi
  const handleUpdatePersonalInfo = () => {
    const updatedInfo = {
      phone,
      summary,
      address,
      birthDate
    };
  
    JobSeekerService.updateResumeInfo(jobSeekerId, updatedInfo)
      .then((response) => {
        toast.success("Kişisel bilgiler başarıyla güncellendi.", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000, // Automatically close after 5 seconds
        });
  
        // 5 saniye sonra yönlendirme işlemi
        setTimeout(() => {
          navigate("/home"); // Yönlendirme işlemi
        }, 3000); // Bu süreyi success mesajının kaybolma süresiyle aynı yapabilirsiniz
      })
      .catch((error) => {
        console.error("Kişisel bilgiler güncellenirken hata oluştu:", error);
      });
  };

  // Email güncelleme işlemi
  const handleUpdateEmail = () => {
    UserService.updateEmail(auth.user.userId, email)
      .then((response) => {
        toast.success("Email başarıyla güncellendi.", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
  
        // Yönlendirme işlemi ekleniyor
        setTimeout(() => {
          navigate("/home"); // Email güncelleme işlemi sonrası home sayfasına yönlendir
        }, 2000); // Bu süreyi success mesajının kaybolma süresiyle aynı yapabilirsiniz
      })
      .catch((error) => {
        toast.error("Email güncellenirken hata oluştu.", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      });
  };

  // LinkedIn URL güncelleme işlemi
  const handleUpdateLinkedinUrl = () => {
    ResumeService.updateLinkedinUrl(resumeId, linkedinUrl)
      .then((response) => {
        toast.success("LinkedIn adresi başarıyla güncellendi.", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });

        setTimeout(() => {
          navigate("/home"); // LinkedIn adresi güncellendikten sonra home sayfasına yönlendir
        }, 2000);
      })
      .catch((error) => {
        toast.error("LinkedIn adresi güncellenirken hata oluştu.", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      });
  };

  // GitHub URL güncelleme işlemi
  const handleUpdateGithubUrl = () => {
    ResumeService.updateGithubUrl(resumeId, githubUrl)
      .then((response) => {
        toast.success("GitHub adresi başarıyla güncellendi.", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });

        setTimeout(() => {
          navigate("/home"); // GitHub adresi güncellendikten sonra home sayfasına yönlendir
        }, 2000);
      })
      .catch((error) => {
        toast.error("GitHub adresi güncellenirken hata oluştu.", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      });
  };

  return (
    <div className="update-container">
        <ToastContainer />
      <h2>İş Arayan Bilgilerini Güncelle</h2>

      {successMessage && <p className="success-message">{successMessage}</p>} {/* Success message display */}

      {/* 1. Bölüm: Kişisel Bilgiler */}
      <div className="section">
        <div className="section-header" onClick={() => toggleSection(1)}>
          <span className="section-title">1. Kişisel Bilgiler</span>
          <button className="expand-button">{section1Open ? '-' : '+'}</button>
        </div>
        {section1Open && (
          <div className="section-content">
            <div className="input-group">
              <label htmlFor="phone">Telefon:</label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="summary">Özet:</label>
              <input
                type="text"
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="address">Adres:</label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="birthDate">Doğum Tarihi:</label>
              <input
                type="date"
                id="birthDate"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>
            <button onClick={handleUpdatePersonalInfo}>Kişisel Bilgiler Güncelle</button>
          </div>
        )}
      </div>

      {/* 2. Bölüm: Email Güncelle */}
      <div className="section">
        <div className="section-header" onClick={() => toggleSection(2)}>
          <span className="section-title">2. Email Güncelle</span>
          <button className="expand-button">{section2Open ? '-' : '+'}</button>
        </div>
        {section2Open && (
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

      {/* 3. Bölüm: Linkedin URL Güncelle */}
      <div className="section">
        <div className="section-header" onClick={() => toggleSection(3)}>
          <span className="section-title">3. Linkedin Adres Güncelle</span>
          <button className="expand-button">{section3Open ? '-' : '+'}</button>
        </div>
        {section3Open && (
          <div className="section-content">
            <div className="input-group">
              <label htmlFor="linkedinUrl">LinkedIn URL:</label>
              <input
                type="text"
                id="linkedinUrl"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
              />
            </div>
            <button onClick={handleUpdateLinkedinUrl}>LinkedIn Güncelle</button>
          </div>
        )}
      </div>

      {/* 4. Bölüm: Github URL Güncelle */}
      <div className="section">
        <div className="section-header" onClick={() => toggleSection(4)}>
          <span className="section-title">4. Github Adres Güncelle</span>
          <button className="expand-button">{section4Open ? '-' : '+'}</button>
        </div>
        {section4Open && (
          <div className="section-content">
            <div className="input-group">
              <label htmlFor="githubUrl">GitHub URL:</label>
              <input
                type="text"
                id="githubUrl"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
              />
            </div>
            <button onClick={handleUpdateGithubUrl}>GitHub Güncelle</button>
          </div>
        )}
      </div>
    </div>
  );
}
