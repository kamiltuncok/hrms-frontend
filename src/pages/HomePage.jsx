import React, { useState, useEffect, useMemo } from 'react';
import { Button, Input, Container, Grid, Card, Image, Header } from 'semantic-ui-react';
import JobAdvertisementService from '../services/jobAdvertisementService';
import JobTitleService from '../services/jobTitleService';
import EmployerService from '../services/employerService';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/HomePage.css';
import kariyernetLogo from '../assets/images/kariyernet.jpg';

export default function HomePage() {
  const [jobAdvertisements, setJobAdvertisements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [jobTitles, setJobTitles] = useState([]);
  const [filteredTitles, setFilteredTitles] = useState([]);

  const jobAdvertisementService = useMemo(() => new JobAdvertisementService(), []);
  const jobTitleService = useMemo(() => new JobTitleService(), []);
  const navigate = useNavigate();

  // Öne çıkan ilanları çek
  useEffect(() => {
    jobAdvertisementService.getThreeJobAdvertisements().then(result => {
      const jobsWithPhotos = result.data.data.map(job => {
        const photoUrl = EmployerService.getEmployerPhotoUrl(job.photoUrl);
        return { ...job, photoUrl };
      });
      setJobAdvertisements(jobsWithPhotos);
    });
  }, [jobAdvertisementService]);

  // Job Titles çek
  useEffect(() => {
    jobTitleService.getJobTitles()
      .then(res => setJobTitles(res.data.data))
      .catch(err => console.log(err));
  }, [jobTitleService]);

  // Arama kutusuna göre filtreleme
  useEffect(() => {
    if (searchTerm) {
      const filtered = jobTitles.filter(jt =>
        jt.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTitles(filtered);
    } else {
      setFilteredTitles([]);
    }
  }, [searchTerm, jobTitles]);

  // Arama butonu veya öneri tıklayınca
  const handleSearch = (jobTitleId) => {
    if (jobTitleId) {
      navigate(`/jobadvertisements/jobtitle/${jobTitleId}`);
    } else if (searchTerm.trim() !== "") {
      navigate(`/jobadvertisements?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate(`/jobadvertisements`);
    }
  };

  const handleDetailsClick = (jobAdvertisementId) => {
    navigate(`/jobadvertisements/detail/${jobAdvertisementId}`);
  };

  return (
    <div className="homepage">
      {/* Header Section */}
      <header className="homepage-header">
        <Container>
          <Grid centered verticalAlign="middle">
            <Grid.Row>
              <Grid.Column computer={8} tablet={12} mobile={16} textAlign="center">
                {/* <Image
                  src={kariyernetLogo}
                  alt="Kariyer.net Logo"
                  className="logo"
                  style={{ width: '120px', height: 'auto', marginBottom: '20px' }}
                /> */}
                <div className="search-section" style={{ position: 'relative' }}>
                  <Header as="h2">İş İlanları Arayın</Header>
                  <Input
                    placeholder="Pozisyon, Şirket veya Şehir Ara..."
                    size="large"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    fluid
                  />
                  {/* Google tarzı autocomplete */}
                  {filteredTitles.length > 0 && (
                    <div className="suggestions-dropdown">
                      {filteredTitles.map(jt => (
                        <div
                          key={jt.id}
                          className="suggestion-item"
                          onClick={() => handleSearch(jt.id)}
                        >
                          {jt.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </header>

      {/* Featured Jobs Section */}
      <section className="featured-jobs">
        <Container>
          <Header as="h3" className="section-title">Öne Çıkan İş İlanları</Header>
          <Grid columns={3} stackable>
            <Grid.Row>
              {jobAdvertisements.length > 0 ? (
                jobAdvertisements.map(jobAdvertisement => (
                  <Grid.Column key={jobAdvertisement.jobAdvertisementId}>
                    <Card>
                      <div className="job-image-container">
                        <Image
                          src={jobAdvertisement.photoUrl || kariyernetLogo}
                          ui={false}
                          className="job-image"
                        />
                      </div>
                      <Card.Content>
                        <Card.Header>{jobAdvertisement.jobTitle}</Card.Header>
                        <Card.Description>
                          {jobAdvertisement.companyName} - {jobAdvertisement.jobName}
                        </Card.Description>
                      </Card.Content>
                      <Card.Content extra>
                        <Button
                          primary
                          fluid
                          onClick={() => handleDetailsClick(jobAdvertisement.jobAdvertisementId)}
                        >
                          Detayları Gör
                        </Button>
                      </Card.Content>
                    </Card>
                  </Grid.Column>
                ))
              ) : (
                <p>Öne çıkan iş ilanları bulunamadı.</p>
              )}
            </Grid.Row>
          </Grid>
        </Container>
      </section>

      {/* Footer */}
      <footer className="homepage-footer">
        <Container>
          <Grid columns={2} stackable>
            <Grid.Row>
              <Grid.Column>
                <p>&copy; 2024 Kariyer.net</p>
              </Grid.Column>
              <Grid.Column textAlign="right">
                <Button>İletişim</Button>
                <Button>Kariyer.net Hakkında</Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </footer>
    </div>
  );
}
