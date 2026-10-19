import { useState } from 'react';

import { apiFetch } from '../util/http.js';

export default function ChangePassword() {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");

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
    }

    return (
        <>
            {open && <form onSubmit={handleSubmit}>
                { error }
                <h2>Change Password Form</h2>

                <br/>
                <label htmlFor="current">Current Password *</label>
                <input id="current" type="password" name="current" required />

                <br/>
                <label htmlFor="new">New Password *</label>
                <input id="new" type="password" name="new" required />

                <br/>
                <label htmlFor="confirm">Confirm New Password *</label>
                <input id="confirm" type="password" name="confirm" required />

                <br/>
                <button type="submit">Submit</button>
            </form> }

            <button type="button" onClick={() => setOpen(o => !o)}>
              {open ? 'Cancel' : 'Change Password'}
            </button>

        </>
    );
}