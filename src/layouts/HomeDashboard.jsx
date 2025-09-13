import React from 'react';
import { Grid } from 'semantic-ui-react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import JobAdvertisementList from '../pages/JobAdvertisementList';
import JobAdvertisementDetail from '../pages/JobAdvertisementDetail';
import JobAdvertisementAdd from '../pages/JobAdvertisementAdd';
import EmployerRegisterPage from '../pages/EmployerRegisterPage';
import JobSeekerRegisterPage from '../pages/JobSeekerRegisterPage';
import EmployerDashboard from './EmployerDashboard';
import JobSeekerDashboard from './JobSeekerDashboard';
import AdminDashboard from './AdminDashboard';
import EmployerDetails from '../pages/EmployerDetails';
import JobSeekerDetails from '../pages/JobSeekerDetails';
import ChangePasswordJobSeeker from '../pages/ChangePasswordJobSeeker';
import ChangePasswordEmployer from '../pages/ChangePasswordEmployer';
import UpdateJobSeekerInfos from '../pages/UpdateJobSeekerInfos';
import UpdateEmployerInfos from '../pages/UpdateEmployerInfos';
import RegisterChoose from './RegisterChoose';

export default function HomeDashboard() {
  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={16}>
          <Routes>
            <Route exact path='/' element={<HomePage />} />
            
            {/* Job Advertisement Routes */}
            <Route path='jobadvertisements'>
              <Route index element={<JobAdvertisementList />} />
              <Route path='jobtitle/:jobTitleId' element={<JobAdvertisementList />} />
              <Route path='detail/:jobAdvertisementId' element={<JobAdvertisementDetail />} />
              <Route path='add' element={<JobAdvertisementAdd />} />
            </Route>
            
            {/* Auth Routes */}
            <Route path='auth'>
              <Route path='registeremployer' element={<EmployerRegisterPage />} />
              <Route path='registerjobseeker' element={<JobSeekerRegisterPage />} />
            </Route>
            
            {/* Profile Routes */}
            <Route path='employerdetails' element={<EmployerDetails />} />
            <Route path='jobseekerdetails' element={<JobSeekerDetails />} />
            <Route path='changepasswordforjobseeker' element={<ChangePasswordJobSeeker />} />
            <Route path='changepasswordforemployer' element={<ChangePasswordEmployer />} />
            <Route path='updatejobseekerinfos' element={<UpdateJobSeekerInfos />} />
            <Route path='updateemployerinfos' element={<UpdateEmployerInfos />} />
            
            {/* Other Routes */}
            <Route path='registerchoose' element={<RegisterChoose />} />
            <Route path='employerdashboard' element={<EmployerDashboard />} />
            <Route path='jobseekerdashboard' element={<JobSeekerDashboard />} />
            <Route path='admindashboard' element={<AdminDashboard />} />
          </Routes>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}