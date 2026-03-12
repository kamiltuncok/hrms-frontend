import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { HomePage } from '@/features/home/pages/HomePage';
import { JobSearchPage } from '@/features/jobs/pages/JobSearchPage';
import { EmployerListPage } from '@/features/employers/pages/EmployerListPage';
import { ProfilePage } from '@/features/profile/pages/ProfilePage';
import { EditProfilePage } from '@/features/profile/pages/EditProfilePage';
import { JobPostPage } from '@/features/jobs/pages/JobPostPage';
import { JobDetailPage } from '@/features/jobs/pages/JobDetailPage';

export const router = createBrowserRouter([
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
          }
        ]
      },
      {
        path: 'employers',
        element: <EmployerListPage />
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
            path: ':id',
            element: <ProfilePage />
          }
        ]
      },
      // App-Level Protected Routes exist within the Layout shell
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
  // Authentication flows omit the AppLayout shell
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  }
]);
