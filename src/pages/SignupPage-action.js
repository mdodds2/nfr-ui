import { redirect } from "react-router-dom";
import { apiFetch } from "../util/http.js";

export async function action({ request }) {

    // might need this later
    //const searchParams = new URL(request.url).searchParams;
    //const mode = searchParams.get('mode') || 'login';

    const data = await request.formData();

    const enteredData = {
        name: data.get('name'),
        email: data.get('email'),
        password: data.get('password'),
        confirmPassword: data.get('confirmPassword'),
    }

    if(enteredData.password !== enteredData.confirmPassword) {
        //return new Response({ message: 'Passwords do not match'}, {status: 422});
        return {message: 'Passwords do not match', status: 422};
    }

    const signupData = {
        name: enteredData.name,
        email: enteredData.email,
        password: enteredData.password,
    }

    const response = await apiFetch('/users', { method: 'POST', body: JSON.stringify(signupData) });

    if (response.status === 400 || response.status === 409) {
        return await response.json();
    }

    if(!response.ok) {
        throw new Response(JSON.stringify({ message: 'Could not add user'}), {status: 500,});
    }

     return redirect('/');
}