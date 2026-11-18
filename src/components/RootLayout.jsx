import { Outlet, useRouteLoaderData } from 'react-router-dom';

import { OrgProvider } from '../store/org-context.jsx';
import Footer from '../components/Footer';
import NavBar from '../ui/NavBar';

export default function RootLayout({ showFooter = false }) {
  const me = useRouteLoaderData('auth');

  return (
    <div className="builder-container" id="builderPage">
      <OrgProvider orgs={me.orgs}>
        <NavBar />
        <Outlet />
      </OrgProvider>
      {showFooter && <Footer />}
    </div>
  );
}
