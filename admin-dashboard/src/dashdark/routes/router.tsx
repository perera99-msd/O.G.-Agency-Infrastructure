import { Suspense, lazy } from 'react';
import { Outlet, createMemoryRouter, Navigate } from 'react-router';
import paths, { rootPaths } from './paths';
import { ProtectedRoute, GuestRoute } from './guards';

import MainLayout from 'layouts/main-layout';
import AuthLayout from 'layouts/auth-layout';
import Splash from 'components/loader/Splash';
import PageLoader from 'components/loader/PageLoader';
import Signin from 'pages/authentication/Signin';
import Error404 from 'pages/Error404';

const App = lazy(() => import('../App'));
const BentoOverview = lazy(() => import('../../components/BentoOverview').then(m => ({ default: m.BentoOverview })));
const DestinationsManager = lazy(() => import('../../components/DestinationsManager').then(m => ({ default: m.DestinationsManager })));
const JobsManager = lazy(() => import('../../components/JobsManager').then(m => ({ default: m.JobsManager })));
const GalleryManager = lazy(() => import('../../components/GalleryManager').then(m => ({ default: m.GalleryManager })));
const BlogsManager = lazy(() => import('../../components/BlogsManager').then(m => ({ default: m.BlogsManager })));
const ContactResponsesManager = lazy(() => import('../../components/ContactResponsesManager').then(m => ({ default: m.ContactResponsesManager })));

const router = createMemoryRouter(
  [
    {
      element: (
        <Suspense fallback={<Splash />}>
          <App />
        </Suspense>
      ),
      children: [
        // ── Protected dashboard routes ────────────────────────────────
        {
          element: <ProtectedRoute />,
          children: [
            {
              path: '/',
              element: (
                <MainLayout>
                  <Suspense fallback={<PageLoader />}>
                    <Outlet />
                  </Suspense>
                </MainLayout>
              ),
              children: [
                { index: true, element: <BentoOverview /> },
                { path: paths.destinations, element: <DestinationsManager /> },
                { path: paths.jobs, element: <JobsManager /> },
                { path: paths.gallery, element: <GalleryManager /> },
                { path: paths.blogs, element: <BlogsManager /> },
                { path: paths.responses, element: <ContactResponsesManager /> },
              ],
            },
          ],
        },

        // ── Guest-only auth routes ────────────────────────────────────
        {
          element: <GuestRoute />,
          children: [
            {
              path: rootPaths.authRoot,
              element: (
                <AuthLayout>
                  <Outlet />
                </AuthLayout>
              ),
              children: [
                { index: true, element: <Navigate to={paths.signin} replace /> },
                { path: paths.signin, element: <Signin /> },
              ],
            },
          ],
        },

        { path: '*', element: <Error404 /> },
      ],
    },
  ],
  {
    initialEntries: ['/'],
  },
);

export default router;
