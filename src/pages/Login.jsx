import { redirect } from 'react-router-dom';
import CredentialsForm from '../components/CredentialsForm.jsx';
import { setAuthToken } from '../util/auth.js';

export default function LoginPage() {
    return <CredentialsForm mode="login" />;
}

export async function action({ request }) {

    // might need this later
    //const searchParams = new URL(request.url).searchParams;
    //const mode = searchParams.get('mode') || 'login';

    const data = await request.formData();
    const authData = {
        email: data.get('email'),
        password: data.get('password'),
    }

    const apiEndpoint = 'http://localhost:8080/auth/login';
      
    const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(authData),
    });

    if(response.status === 422 || response.status === 401) {
        return { message: 'Invalid email or password.  Please try again', status: 401}
    }

    if(!response.ok) {
        throw new Response(JSON.stringify({ message: 'Could not authenticate user'}), {status: 500,});
    }

    const responseData = await response.json();
    const token = responseData.token;
    setAuthToken(token);

    return redirect('/main');
}