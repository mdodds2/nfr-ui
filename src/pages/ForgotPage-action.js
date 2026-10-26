import { redirect } from 'react-router-dom';
import { forgotPassword } from '../util/http.js';

export async function action({ request }) {

    const data = await request.formData();
    const forgotData = {
        email: data.get('email')
    }

    await forgotPassword(forgotData);

    return redirect('/login');
}