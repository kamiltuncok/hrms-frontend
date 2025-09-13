import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import JobAdvertisementService from "../services/jobAdvertisementService";
import EmployerService from "../services/employerService";
import { Image } from "semantic-ui-react";
import "../assets/styles/JobAdvertisementDetail.css";

export default function JobAdvertisementDetail() {
  const { jobAdvertisementId } = useParams();
  const [jobadvertisement, setJobAdvertisement] = useState({});

  useEffect(() => {
    let jobAdvertisementService = new JobAdvertisementService();

    jobAdvertisementService.getJobAdvertisementById(jobAdvertisementId).then((result) => {
      const jobData = result.data.data;

      if (jobData.employer && jobData.employer.id) {
        EmployerService.getEmployerByEmployerId(jobData.employer.id).then((empResult) => {
          const employerData = empResult.data.data;
          const fullPhotoUrl = EmployerService.getEmployerPhotoUrl(employerData.photoUrl);
          setJobAdvertisement({ ...jobData, photoUrl: fullPhotoUrl });
        });
      } else {
        setJobAdvertisement(jobData);
      }
    });
  }, [jobAdvertisementId]);

  return (
    <div className="job-advertisement-detail">
      <div className="job-advertisement-container">
        <div className="image-section">
          <Image
            src={jobadvertisement.photoUrl || "https://via.placeholder.com/400x300"}
            wrapped
            ui={false}
            className="job-image"
          />
        </div>
        <div className="details-section">
          <h2>{jobadvertisement.jobName}</h2>
          <p>
            <strong>Açıklama:</strong> {jobadvertisement.description}
          </p>
        </div>
      </div>

      <div className="additional-details">
        <p>
          <strong>İş Veren:</strong>{" "}
          {jobadvertisement.employer?.companyName || "Bilgi Yok"}
        </p>
        <p>
          <strong>Çalışma Modeli:</strong> {jobadvertisement.workModel?.name || "Bilgi Yok"}
        </p>
        <p>
          <strong>Şehir:</strong> {jobadvertisement.city?.name || "Bilgi Yok"}
        </p>
        <p>
          <strong>En Yüksek Maaş:</strong> {jobadvertisement.maxSalary || "Bilgi Yok"}
        </p>
        <p>
          <strong>En Düşük Maaş:</strong> {jobadvertisement.minSalary || "Bilgi Yok"}
        </p>
        <p>
          <strong>Boş Pozisyon:</strong>{" "}
          {jobadvertisement.freePositionAmount || "Bilgi Yok"}
        </p>
      </div>

      <div className="button-container">
        <button className="apply-button">İş Başvurusu Yap</button>
      </div>
    </div>
  );
}
