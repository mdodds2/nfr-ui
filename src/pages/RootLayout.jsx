import { Outlet, useNavigate, useSubmit } from 'react-router-dom';
import Footer from '../components/Footer';
import { useEffect } from 'react';
import { getAuthToken, getUserData } from '../util/auth';
import NavBar from '../ui/NavBar';

const showFooter = false;

export default function RootLayout() {

    const token = getAuthToken();
    const userData = getUserData();
    const submit = useSubmit();

    const navigate = useNavigate();

    useEffect( () => {

        if(token === null ) {
            return navigate('/login');
        }

        const exp = new Date(userData.expiry * 1000 ).getTime();
        const now = new Date().getTime();
        const duration = exp - now;

        setTimeout(() => {
            submit(null, {action: '/logout', method: 'GET'})
        }, duration);

    }, [userData, submit]);

    return (
        <div className="builder-container" id="builderPage">
            <NavBar />
            <Outlet />
            {showFooter && <Footer />}
        </div>
    );
}
