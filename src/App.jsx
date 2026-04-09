import { useContext } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import LoginPage, { action as loginAction } from './pages/Login.jsx';
import SignupPage, { action as signupAction } from './pages/SignupPage.jsx';
import ForgotPage, {action as forgotAction } from './pages/ForgotPage.jsx';
import MainPage from './pages/MainPage.jsx';
import RootLayout from './pages/RootLayout.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ErrorPage from './pages/Error.jsx';
import AdminPage from './pages/Admin.jsx';
import ProfilePage from './pages/Profile.jsx';
import LogoutPage from './pages/Logout.jsx';

import ShowRequirements from './pages/ShowRequirements.jsx';
import ShowRequirement from './pages/ShowRequirement.jsx';
import NewRequirement, { action as addRequirementAction } from './pages/NewRequirement.jsx';
import EditRequirement, { action as updateRequirementAction, loader as getRequirementLoader } from './pages/EditRequirement.jsx';

import ReportsPage, { loader as getReportsForUser } from './pages/Reports.jsx';
import NewReport, { action as addReportAction, loader as newReportLoader } from './pages/NewReport.jsx';
import ShowReport, { loader as getReportLoader } from './pages/ShowReport.jsx';
import EditReport, { loader as updateReportLoader, action as updateReportAction } from './pages/EditReport.jsx';
import DeleteReport from './pages/DeleteReport.jsx';

import { getCategories } from './util/http.js';
import { checkAuthLoader, logout as logoutLoader } from './util/auth.js';

import CartContext from "./store/cart-context.jsx";

function App() {

  const cartContext = useContext(CartContext);
  
  const router = createBrowserRouter(
    [
      { path: '/', element: <LoginPage />, errorElement: <ErrorPage />, action: loginAction },
      { path: '/login', element: <LoginPage />, errorElement: <ErrorPage />, action: loginAction },
      { path: '/signup', element: <SignupPage />, errorElement: <ErrorPage />, action: signupAction },
      { path: '/forgot', element: <ForgotPage />, action: forgotAction },

      {
        path: '/main',
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <MainPage /> },
          { path: 'about', element: <AboutPage /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'admin', element: <AdminPage /> },
        ]
      },

      {
        path: '/requirements',
        element: <RootLayout />,
        loader: checkAuthLoader,
        HydrateFallback: () => null,
        errorElement: <ErrorPage />,
        children: [
          { path: '/requirements/new', element: <NewRequirement />, action: addRequirementAction, loader: getCategories, HydrateFallback: () => null, },
          { path: '/requirements/edit/:id', element: <EditRequirement />, action: updateRequirementAction, loader: getRequirementLoader, HydrateFallback: () => null, },
          { path: '/requirements/displayAll', element: <ShowRequirements />, loader: getCategories, HydrateFallback: () => null, },
          { path: '/requirements/display/:id', element: <ShowRequirement />, loader: getRequirementLoader, HydrateFallback: () => null, },
        ]
      },

      {
        path: '/reports',
        element: <RootLayout />,
        loader: checkAuthLoader,
        HydrateFallback: () => null,
        errorElement: <ErrorPage />,
        children: [
          { path: '/reports/', element: <ReportsPage />, loader: getReportsForUser, HydrateFallback: () => null, },
          { path: '/reports/new', element: <NewReport />, action: addReportAction(cartContext), loader: newReportLoader, HydrateFallback: () => null, },
          { path: '/reports/edit/:id', element: <EditReport />, action: updateReportAction(cartContext), loader: updateReportLoader, HydrateFallback: () => null, },
          { path: '/reports/delete', element: <DeleteReport />, },
        ]
      },
      { path: '/reports/display/:id', element: <ShowReport />, loader: getReportLoader, HydrateFallback: () => null, },

      { path: '/logout', element: <LogoutPage />, loader: logoutLoader, HydrateFallback: () => null, },
    ]
  );

  return <RouterProvider router={router} />
}

export default App;