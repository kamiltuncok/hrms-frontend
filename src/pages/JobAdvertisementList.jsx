import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Image } from 'semantic-ui-react';
import JobAdvertisementService from '../services/jobAdvertisementService';
import CityService from "../services/cityService.js";
import WorkModelService from "../services/workModelService.js";
import TypeOfWorkService from "../services/typeOfWorkService.js";
import { Link, useParams } from 'react-router-dom';
import '../assets/styles/JobAdvertisementList.css';

export default function JobAdvertisementList() {
  const [allJobAdvertisements, setAllJobAdvertisements] = useState([]);
  const [filteredJobAdvertisements, setFilteredJobAdvertisements] = useState([]);
  const [cities, setCities] = useState([]);
  const [workModels, setWorkModels] = useState([]);
  const [typeOfWorks, setTypeOfWorks] = useState([]);
  const [selectedJobTitle, setSelectedJobTitle] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedWorkModels, setSelectedWorkModels] = useState([]);
  const [selectedTypeOfWorks, setSelectedTypeOfWorks] = useState([]);

  // URL parametrelerini al
  const { jobTitleId } = useParams();

  // Servisleri useMemo ile oluştur
  const jobAdvertisementService = useMemo(() => new JobAdvertisementService(), []);
  const cityService = useMemo(() => new CityService(), []);
  const workModelService = useMemo(() => new WorkModelService(), []);
  const typeOfWorkService = useMemo(() => new TypeOfWorkService(), []);

  // Employer foto URL
  const getEmployerPhotoUrl = (photoPath) => {
    if (!photoPath) return "https://www.aydemperakende.com.tr/storage/blog/elektrik_nedir_elektrik_evimize_nasil_ulasir.jpg";
    return `http://localhost:8080/uploads/${photoPath}`;
  };

  // Checkbox toggle
  const toggleSelection = (id, selectedList, setSelectedList) => {
    if (selectedList.includes(id)) {
      setSelectedList(selectedList.filter(item => item !== id));
    } else {
      setSelectedList([...selectedList, id]);
    }
  };

  // Filtreleme fonksiyonu
  const applyFilters = useCallback((jobs) => {
    let filtered = jobs;

    // Job title filtresi (URL'den gelen)
    if (jobTitleId) {
      filtered = filtered.filter(job => job.jobTitle?.id === parseInt(jobTitleId));
    }

    // Diğer filtreler
    if (selectedCities.length > 0) {
      filtered = filtered.filter(job => selectedCities.includes(job.city?.id));
    }
    if (selectedWorkModels.length > 0) {
      filtered = filtered.filter(job => selectedWorkModels.includes(job.workModel?.id));
    }
    if (selectedTypeOfWorks.length > 0) {
      filtered = filtered.filter(job => selectedTypeOfWorks.includes(job.typeOfWork?.id));
    }

    setFilteredJobAdvertisements(filtered);
    setLoading(false);
  }, [jobTitleId, selectedCities, selectedWorkModels, selectedTypeOfWorks]);

  // İş ilanlarını yükleme
  const loadAdvertisements = useCallback(() => {
    setLoading(true);
    
    if (jobTitleId) {
      // Hem job title hem de diğer filtreler için tüm aktif ilanları getir
      jobAdvertisementService.getActiveJobadvertisement()
        .then(res => {
          setAllJobAdvertisements(res.data.data);
          applyFilters(res.data.data);
          
          // Job title bilgisini al
          const jobTitleAds = res.data.data.filter(job => job.jobTitle?.id === parseInt(jobTitleId));
          if (jobTitleAds.length > 0) {
            setSelectedJobTitle(jobTitleAds[0].jobTitle?.title);
          }
        })
        .catch(() => {
          setAllJobAdvertisements([]);
          setFilteredJobAdvertisements([]);
          setLoading(false);
        });
    } else {
      // Sadece tüm aktif ilanları getir
      jobAdvertisementService.getActiveJobadvertisement()
        .then(res => {
          setAllJobAdvertisements(res.data.data);
          applyFilters(res.data.data);
        })
        .catch(() => {
          setAllJobAdvertisements([]);
          setFilteredJobAdvertisements([]);
          setLoading(false);
        });
    }
  }, [jobAdvertisementService, applyFilters, jobTitleId]);

  // Servislerden şehir, model ve çalışma türlerini çek
  useEffect(() => {
    cityService.getCities().then(result => setCities(result.data.data));
    workModelService.getWorkModels().then(result => setWorkModels(result.data.data));
    typeOfWorkService.getTypeOfWorks().then(result => setTypeOfWorks(result.data.data));
    loadAdvertisements();
  }, [cityService, workModelService, typeOfWorkService, loadAdvertisements]);

  // Filtreler veya jobTitleId değiştiğinde filtreleme yap
  useEffect(() => {
    applyFilters(allJobAdvertisements);
  }, [applyFilters, allJobAdvertisements, selectedCities, selectedWorkModels, selectedTypeOfWorks, jobTitleId]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="job-advertisement-page">
      <div className="filter-section">
        <h3>Filtreleme</h3>

        {/* Job title filtresi göster */}
        {selectedJobTitle && (
          <div className="selected-job-title">
            <strong>Pozisyon: </strong>{selectedJobTitle}
          </div>
        )}

        <label>Şehirler:</label>
        {cities.map(city => (
          <div key={city.id} className="checkbox-wrapper">
            <input
              type="checkbox"
              checked={selectedCities.includes(city.id)}
              onChange={() => toggleSelection(city.id, selectedCities, setSelectedCities)}
            />
            <span>{city.name}</span>
          </div>
        ))}

        <label>Çalışma Modelleri:</label>
        {workModels.map(model => (
          <div key={model.id} className="checkbox-wrapper">
            <input
              type="checkbox"
              checked={selectedWorkModels.includes(model.id)}
              onChange={() => toggleSelection(model.id, selectedWorkModels, setSelectedWorkModels)}
            />
            <span>{model.name}</span>
          </div>
        ))}

        <label>Çalışma Türleri:</label>
        {typeOfWorks.map(type => (
          <div key={type.id} className="checkbox-wrapper">
            <input
              type="checkbox"
              checked={selectedTypeOfWorks.includes(type.id)}
              onChange={() => toggleSelection(type.id, selectedTypeOfWorks, setSelectedTypeOfWorks)}
            />
            <span>{type.name}</span>
          </div>
        ))}
      </div>

      <div className="job-list">
        {/* Başlık göster */}
        {selectedJobTitle ? (
          <h3>{selectedJobTitle} Pozisyonundaki İlanlar ({filteredJobAdvertisements.length})</h3>
        ) : (
          <h3>Tüm İş İlanları ({filteredJobAdvertisements.length})</h3>
        )}

        {filteredJobAdvertisements.length > 0 ? (
          filteredJobAdvertisements.map(jobadvertisement => (
            <div key={jobadvertisement.id} className="job-card">
              <div className="card-content">
                <Image
                  src={getEmployerPhotoUrl(jobadvertisement.employer?.photoUrl)}
                  className="job-image"
                />
                <div className="card-details">
                  <h4>{jobadvertisement.jobTitle?.title || "Pozisyon Bilgisi Yok"}</h4>
                  <p>{jobadvertisement.employer?.companyName || "Şirket Bilgisi Yok"}</p>
                  <p>
                    {jobadvertisement.city?.name || "Şehir Bilgisi Yok"} - {jobadvertisement.workModel?.name || "Çalışma Modeli Yok"}
                  </p>
                  <p>{jobadvertisement.typeOfWork?.name || "Çalışma Türü Yok"}</p>
                  <Link to={`/jobadvertisements/detail/${jobadvertisement.id}`} className="link-button">
                    İlana Git
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>İş ilanları bulunamadı.</p>
        )}
      </div>
    </div>
  );
}