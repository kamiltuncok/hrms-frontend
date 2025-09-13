import React, { useEffect, useState } from 'react';
import { Dropdown, Image, Menu } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import JobSeekerService from '../services/jobSeekerService';
import EmployerService from '../services/employerService';
import ResumeService from '../services/resumeService';

export default function SignedIn(props) {
  const [displayName, setDisplayName] = useState('');
  const [photoUrl, setPhotoUrl] = useState(null); // Başlangıçta null
  const [resume, setResume] = useState(null);
  const [employer, setEmployer] = useState(null);

  // Redux store'dan auth verisini alıyoruz
  const auth = useSelector((state) => state.auth?.data);
  const token = auth?.token;

  const navigate = useNavigate();

  useEffect(() => {
    if (auth && token) {
      const { roleName, userId } = auth.user;

      if (roleName === 'JOBSEEKER') {
        JobSeekerService.getJobSeekerByUserId(userId)
          .then((response) => {
            const jobSeekerData = response.data.data;
            setDisplayName(jobSeekerData.firstName);

            // JobSeeker için Resume verisini alıyoruz
            ResumeService.getResumeByJobSeekerId(jobSeekerData.id)
              .then((res) => {
                const resumeData = res.data.data;
                setResume(resumeData); // Veriyi set ediyoruz
                const photoUrl = resumeData?.photo?.photoUrl
                  ? ResumeService.getUserPhotoUrl(resumeData.photo.photoUrl)
                  : null;
                setPhotoUrl(photoUrl);
              })
              .catch((error) => {
                console.error("Resume verisi alınamadı:", error);
              });
          })
          .catch((error) => console.error('JobSeeker bilgileri alınamadı:', error));
      } else if (roleName === 'EMPLOYER') {
        EmployerService.getEmployerByUserId(userId)
          .then((response) => {
            const employerData = response.data.data;
            setDisplayName(employerData.companyName);
            setEmployer(employerData);

            // Employer için fotoğraf URL'sini ayarlıyoruz
            const photoUrl = employerData?.photoUrl
              ? EmployerService.getEmployerPhotoUrl(employerData.photoUrl)
              : null;
            setPhotoUrl(photoUrl);
          })
          .catch((error) => console.error('Employer bilgileri alınamadı:', error));
      }
    }
  }, [auth, token]); // Yalnızca auth ve token'a bağlı olarak çalışacak

  const handleProfileClick = () => {
    const { roleName } = auth.user;
    if (roleName === 'JOBSEEKER') {
      navigate('/jobseekerdetails');
    } else if (roleName === 'EMPLOYER') {
      navigate('/employerdetails');
    }
  };

  return (
    <div>
      <Menu.Item>
        <Image avatar spaced="right" src={photoUrl || ''} /> {/* photoUrl null ise boş string olarak ayarlanır */}
        <Dropdown pointing="top left" text={displayName || 'Kamil'}>
          <Dropdown.Menu>
            <Dropdown.Item onClick={handleProfileClick} text="Bilgilerim" icon="info" />
            <Dropdown.Item onClick={props.signOut} text="Çıkış Yap" icon="sign-out" />
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Item>
    </div>
  );
}
