import { createBrowserRouter, Outlet } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage';
import { HomePage } from '@/features/home/pages/HomePage';
import { JobSearchPage } from '@/features/jobs/pages/JobSearchPage';
import { EmployerListPage } from '@/features/employers/pages/EmployerListPage';
import { ProfilePage } from '@/features/profile/pages/ProfilePage';
import { EditProfilePage } from '@/features/profile/pages/EditProfilePage';
import { JobPostPage } from '@/features/jobs/pages/JobPostPage';
import { JobDetailPage } from '@/features/jobs/pages/JobDetailPage';
import { EmployerApplicationsPage } from '@/features/jobs/pages/EmployerApplicationsPage';
import { AppliedJobsPage } from '@/features/applications/pages/AppliedJobsPage';
import { ScrollToTop } from '@/components/common/ScrollToTop';

// A root wrapper that resets scroll on every route change
const RootWrapper = () => (
  <>
    <ScrollToTop />
    <Outlet />
  </>
);

export const router = createBrowserRouter([
  {
    element: <RootWrapper />,
    children: [
      {
        path: '/',
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <HomePage />
          },
          {
            path: 'jobs',
            children: [
              {
                index: true,
                element: <JobSearchPage />
              },
              {
                path: 'post',
                element: <ProtectedRoute requiredRole="Employer" />,
                children: [
                  {
                    index: true,
                    element: <JobPostPage />
                  }
                ]
              },
              {
                path: ':id',
                element: <JobDetailPage />
              },
              {
                path: 'applications',
                element: <ProtectedRoute requiredRole="Employer" />,
                children: [
                  {
                    index: true,
                    element: <EmployerApplicationsPage />
                  }
                ]
              }
            ]
          },
          {
            path: 'employers',
            children: [
              {
                index: true,
                element: <EmployerListPage />
              },
              {
                path: ':id',
                element: <ProfilePage />
              }
            ]
          },
          {
            path: 'profile',
            element: <ProtectedRoute />,
            children: [
              {
                index: true,
                element: <ProfilePage />
              },
              {
                path: 'edit',
                element: <EditProfilePage />
              },
              {
                path: 'applied-jobs',
                element: <AppliedJobsPage />
              },
              {
                path: ':id',
                element: <ProfilePage />
              }
            ]
          },
          {
            path: 'dashboard',
            element: <ProtectedRoute />, 
            children: [
              {
                index: true,
                element: <div className="p-8">Protected Dashboard Area</div>
              }
            ]
          }
        ]
      },
      // Authentication flows
      {
        path: '/login',
        element: <LoginPage />
      },
      {
        path: '/register',
        element: <RegisterPage />
      },
      {
        path: '/forgot-password',
        element: <ForgotPasswordPage />
      },
      {
        path: '/reset-password',
        element: <ResetPasswordPage />
      }
    ]
  }
]);

