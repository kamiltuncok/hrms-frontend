// AppRoutes.js veya index.js içinde kullanılabilir
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Public / Home Pages
import HomeDashboard from './HomeDashboard';
import HomePage from '../pages/HomePage';
import JobAdvertisementList from '../pages/JobAdvertisementList';
import JobAdvertisementDetail from '../pages/JobAdvertisementDetail';
import LoginPage from '../pages/LoginPage';
import RegisterChoose from './RegisterChoose';
import EmployerRegisterPage from '../pages/EmployerRegisterPage';
import JobSeekerRegisterPage from '../pages/JobSeekerRegisterPage';
import CityList from '../pages/CityList';

// Auth / Role Based Dashboard
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';
import EmployerDashboard from './EmployerDashboard';
import JobSeekerDashboard from './JobSeekerDashboard';

// Other Pages
import EmployerDetails from '../pages/EmployerDetails';
import JobSeekerDetails from '../pages/JobSeekerDetails';
import ChangePasswordJobSeeker from '../pages/ChangePasswordJobSeeker';
import ChangePasswordEmployer from '../pages/ChangePasswordEmployer';
import UpdateJobSeekerInfos from '../pages/UpdateJobSeekerInfos';
import UpdateEmployerInfos from '../pages/UpdateEmployerInfos';

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes / HomeDashboard */}
            <Route path="/" element={<HomeDashboard />}>
                <Route index element={<HomePage />} />
                <Route path="home" element={<HomePage />} />
                <Route path="jobadvertisements" element={<JobAdvertisementList />} />
                <Route path="jobadvertisements/jobtitle/:jobTitleId" element={<JobAdvertisementList />} />
                <Route path="jobadvertisements/:jobAdvertisementId" element={<JobAdvertisementDetail />} />
                <Route exact path='/jobadvertisements/detail/:jobAdvertisementId' element={<JobAdvertisementDetail />} />
            </Route>

            {/* Auth / Public Pages */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/registerchoose" element={<RegisterChoose />} />
            <Route path="/auth/registeremployer" element={<EmployerRegisterPage />} />
            <Route path="/auth/registerjobseeker" element={<JobSeekerRegisterPage />} />
            <Route path="/citylist" element={<CityList />} />
            <Route path="/employerdetails" element={<EmployerDetails />} />
            <Route path="/jobseekerdetails" element={<JobSeekerDetails />} />
            <Route path="/changepasswordforjobseeker" element={<ChangePasswordJobSeeker />} />
            <Route path="/changepasswordforemployer" element={<ChangePasswordEmployer />} />
            <Route path="/updatejobseekerinfos" element={<UpdateJobSeekerInfos />} />
            <Route path="/updateemployerinfos" element={<UpdateEmployerInfos />} />

            {/* Role-Based Dashboard */}
            <Route path="/dashboard/*" element={<Dashboard />}>
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="employer" element={<EmployerDashboard />} />
                <Route path="jobseeker" element={<JobSeekerDashboard />} />
            </Route>
        </Routes>
    );
}
