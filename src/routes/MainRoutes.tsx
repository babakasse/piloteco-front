import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project-imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import PagesLayout from 'layout/Pages';
import SimpleLayout from 'layout/Simple';
import { SimpleLayoutType } from 'config';

const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/error/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/error/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction/under-construction')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon/coming-soon')));

const AppContactUS = Loadable(lazy(() => import('pages/contact-us')));
const AssessmentCreatePage = Loadable(lazy(() => import('pages/assessment-create')));
const AssessmentListPage = Loadable(lazy(() => import('pages/assessment-list')));
const AssessmentEmissionsPage = Loadable(lazy(() => import('pages/assessment-emissions')));
const AssessmentDetailsPage = Loadable(lazy(() => import('pages/assessment-details')));
// render - dashboard page
const Dashboard = Loadable(lazy(() => import('pages/dashboard')));
const CompaniesPage = Loadable(lazy(() => import('pages/companies')));

// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = {
  path: '',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <Navigate to="/app/dashboard" replace />
    },
    {
      path: 'dashboard',
      element: <Dashboard />
    },
    {
      path: 'assessment-create',
      element: <AssessmentCreatePage />
    },
    {
      path: 'assessment-list',
      element: <AssessmentListPage />
    },
    {
      path: 'assessment/:id/emissions',
      element: <AssessmentEmissionsPage />
    },
    {
      path: 'assessment/:id',
      element: <AssessmentDetailsPage />
    },
    {
      path: 'companies',
      element: <CompaniesPage />
    },
    {
      path: 'contact-us',
      element: <AppContactUS />
    }
  ]
};

export default MainRoutes;
