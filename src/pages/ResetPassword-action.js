import { redirect } from 'react-router-dom';

import { resetPassword } from '../util/http.js';

export async function action({ request }) {

    const data = await request.formData();
    const token = new URL(request.url).searchParams.get('token');

    const newPassword = data.get('newPassword');
    if (newPassword !== data.get('confirmPassword')) {
      return { error: 'Passwords do not match' };
    }

    try {
      await resetPassword({ token, newPassword });
    } catch {
      return { error: 'This reset link is invalid or has expired.' };
    }

    return redirect('/login');
}