import { Outlet } from 'react-router-dom';

import Footer from '../components/Footer';
import NavBar from '../ui/NavBar';

export default function RootLayout({ showFooter = false }) {
  return (
    <div className="builder-container" id="builderPage">
      <NavBar />
      <Outlet />
      {showFooter && <Footer />}
    </div>
  );
}
