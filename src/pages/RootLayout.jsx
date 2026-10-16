import { Outlet } from 'react-router-dom';

import Footer from '../components/Footer';
import NavBar from '../ui/NavBar';

const showFooter = false;

export default function RootLayout() {

    return (
        <div className="builder-container" id="builderPage">
            <NavBar />
            <Outlet />
            {showFooter && <Footer />}
        </div>
    );
}
