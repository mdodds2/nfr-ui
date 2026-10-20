import { redirect } from 'react-router-dom';
import { setAuthToken } from '../util/auth.js';
import { API_URL } from '../util/http.js';

export async function action({ request }) {

    const data = await request.formData();
    const authData = {
        email: data.get('email'),
        password: data.get('password'),
    }

    const apiEndpoint = `${API_URL}/auth/login`;

    const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(authData),
    });

    if (response.status === 400 || response.status === 401) {
        return { error: 'Invalid email or password. Please try again.' };
    }

    if(!response.ok) {
        throw new Response(JSON.stringify({ message: 'Could not authenticate user'}), {status: 500,});
    }

    const responseData = await response.json();
    const token = responseData.token;
    setAuthToken(token);

    return redirect('/main');
}