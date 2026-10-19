import { useState } from 'react';

import { apiFetch } from '../util/http.js';

export default function ChangePassword() {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.target));

        if (data.new !== data.confirm) { setError('Passwords do not match'); return; }
        const res = await apiFetch(`/users/me/change-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ oldPassword: data.current, newPassword: data.new }),
        });

        if (!res.ok) {
            setError((await res.json()).error); return;
        }
        setOpen(false);
        setError("");
        setMessage("Password successfully changed.");
    }

    return (
        <>
            {message && <p className="success">{message}</p>}
            {open && <form onSubmit={handleSubmit}>
                { error &&  <p className="error">{error}</p>}
                <h2>Change Password Form</h2>

                <br/>
                <label htmlFor="current">Current Password *</label>
                <input id="current" type="password" name="current" autoComplete="current-password" required />

                <br/>
                <label htmlFor="new">New Password *</label>
                <input id="new" type="password" name="new" minLength="8" maxLength="72" autoComplete="new-password" required />

                <br/>
                <label htmlFor="confirm">Confirm New Password *</label>
                <input id="confirm" type="password" name="confirm" minLength="8" maxLength="72" autoComplete="new-password" required />

                <br/>
                <button type="submit">Submit</button>
            </form> }

            <button type="button" onClick={() => { setMessage(''); setError(''); setOpen(o => !o)}}>
              {open ? 'Cancel' : 'Change Password'}
            </button>

        </>
    );
}