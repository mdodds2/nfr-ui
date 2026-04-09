import { redirect } from "react-router-dom";
import CredentialsForm from "../components/CredentialsForm";

export default function ForgotPage() {
    return <CredentialsForm mode="forgot" />;
}

export async function action({ request }) {

    const data = await request.formData();
    const authData = {
        email: data.get('email'),
        password: data.get('password'),
        newPassword: data.get('newPassword'),
        confirmPassword: data.get('confirmPassword'),
    }

    if(authData.newPassword !== authData.confirmPassword) {
        return { message: 'New password does not match confirmation password.  Please try again.', status: 401 }    
    }

    const apiEndpoint = 'http://localhost:8080/auth/changePassword';
      
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
        throw new Response(JSON.stringify({ message: 'Could not change password.'}), {status: 500,});
    }

    return redirect('/');

}
