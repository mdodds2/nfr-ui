/* eslint-disable react-hooks/refs -- loaders/actions read ref.current at navigation time, not during render */
import { useContext, useMemo, useRef } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import LoginPage from './features/auth/Login.jsx';
import { action as loginAction } from './features/auth/Login-action.js';

import SignupPage from './features/auth/SignupPage.jsx';
import { action as signupAction } from './features/auth/SignupPage-action.js';

import ForgotPage from './features/auth/ForgotPage.jsx';
import { action as forgotAction } from './features/auth/ForgotPage-action.js';

import ResetPassword from './features/auth/ResetPassword.jsx';
import { action as resetPasswordAction } from './features/auth/ResetPassword-action.js';

import MainPage from './components/MainPage.jsx';
import RootLayout from './components/RootLayout.jsx';

import AboutPage from './features/about/AboutPage.jsx';
import ErrorPage from './components/Error.jsx';
import AdminPage from './features/admin/Admin.jsx';
import ProfilePage from './features/users/Profile.jsx';
import LogoutPage from './features/auth/Logout.jsx';
import { loader as logoutLoader} from './features/auth/Logout-loader.js';

import ShowRequirements from './features/requirements/ShowRequirements.jsx';
import ShowRequirement from './features/requirements/ShowRequirement.jsx';

import NewRequirement from './features/requirements/NewRequirement.jsx';
import { action as addRequirementAction } from './features/requirements/NewRequirement-action.js';
import { loader as addRequirementLoader } from './features/requirements/NewRequirement-loader.js';

import { action as updateRequirementAction } from './features/requirements/EditRequirement-action.js';
import { loader as getRequirementLoader } from './features/requirements/EditRequirement-loader.js';
import EditRequirement from './features/requirements/EditRequirement.jsx';

import DeleteRequirement from './features/requirements/DeleteRequirement.jsx';
import { action as deleteRequirementAction } from './features/requirements/DeleteRequirement-action.js';

import ReportsPage from './features/reports/Reports.jsx';
import { loader as getReportsForUser } from './features/reports/Reports-loader.js';

import {action as addReportAction} from './features/reports/NewReport-action.js';
import {loader as addReportLoader} from './features/reports/NewReport-loader.js';
import NewReport from './features/reports/NewReport.jsx';

import ShowReport from './features/reports/ShowReport.jsx';
import { loader as getReportLoader } from './features/reports/ShowReport-loader.js';

import { action as updateReportAction } from './features/reports/EditReport-action.js';
import { loader as updateReportLoader } from './features/reports/EditReport-loader.js';
import EditReport from './features/reports/EditReport.jsx';

import DeleteReport from './features/reports/DeleteReport.jsx';

import { getCategories } from './util/http.js';
import { checkAuthLoader, authUserLoader } from './util/auth.js';

import CartContext from "./store/cart-context.jsx";
import { DisplayContext } from "./store/display-context-object";

import OrgAdmin from "./features/orgs/OrgAdmin.jsx";
import { loader as getOrganizations } from './features/orgs/GetOrganizations-loader.js';

import ShowMembers from "./features/orgs/ShowMembers.jsx";
import { loader as showMembersLoader } from './features/orgs/ShowMembers-loader.js';
import { action as showMembersAction } from './features/orgs/ShowMembers-action.js';

function App() {

  const cartContext = useContext(CartContext);
  const displayContext = useContext(DisplayContext);

  const cartRef = useRef(cartContext);
  cartRef.current = cartContext; // updated every render

  const displayRef = useRef(displayContext);
  displayRef.current = displayContext; // updated every render

  const router = useMemo( () => createBrowserRouter([
      { path: '/', element: <LoginPage />, errorElement: <ErrorPage />, action: loginAction },
      { path: '/login', element: <LoginPage />, errorElement: <ErrorPage />, action: loginAction },
      { path: '/signup', element: <SignupPage />, errorElement: <ErrorPage />, action: signupAction },
      { path: '/forgot', element: <ForgotPage />, action: forgotAction },
      { path: '/reset-password', element: <ResetPassword />, action: resetPasswordAction },

      {
        loader: checkAuthLoader,
        errorElement: <ErrorPage />,
        HydrateFallback: () => null,
        children: [
            { path: '/reports/display/:id', element: <ShowReport />, loader: getReportLoader },
        ]
      },

      {
        id: 'auth',
        element: <RootLayout />,
        loader: authUserLoader,
        errorElement: <ErrorPage />,
        HydrateFallback: () => null,
        children: [
            { path: '/main',
                 children: [
                   { index: true, element: <MainPage /> },
                   { path: 'about', element: <AboutPage /> },
                   { path: 'profile', element: <ProfilePage  />, loader: getOrganizations },
                   { path: 'admin', element: <AdminPage /> },
                 ]
            },

            { path: '/requirements',
                children: [
                   { path: '/requirements/new', element: <NewRequirement />, action: addRequirementAction, loader: addRequirementLoader(displayRef) },
                   { path: '/requirements/edit/:id', element: <EditRequirement />, action: updateRequirementAction, loader: getRequirementLoader },
                   { path: '/requirements/displayAll', element: <ShowRequirements />, loader: getCategories },
                   { path: '/requirements/display/:id', element: <ShowRequirement />, loader: getRequirementLoader },
                   { path: '/requirements/delete/:id', element: <DeleteRequirement />, action: deleteRequirementAction, loader: getRequirementLoader },
               ]
            },

            { path: '/reports',
                children: [
                  { index: true, element: <ReportsPage />, loader: getReportsForUser },
                  { path: '/reports/new', element: <NewReport />, action: addReportAction(cartRef), loader: addReportLoader },
                  { path: '/reports/edit/:id', element: <EditReport />, action: updateReportAction(cartRef), loader: updateReportLoader(cartRef) },
                  { path: '/reports/delete', element: <DeleteReport />, },
                ]
            },

            { path: '/organizations',
                children: [
                    { index: true, element: <OrgAdmin />, loader: getOrganizations },
                    { path: '/organizations/:orgId/members', element: <ShowMembers />, loader: showMembersLoader, action: showMembersAction },
                ]
            },
        ]
      },

      { path: '/logout', element: <LogoutPage />, loader: logoutLoader(displayRef), HydrateFallback: () => null, },

    ]), []);

  return <RouterProvider router={router} />
}

export default App;
