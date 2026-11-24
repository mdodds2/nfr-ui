import { useState, useEffect } from 'react';
import { useFetcher } from 'react-router-dom';

export default function MemberRow({ member }) {
  const fetcher = useFetcher();
  const [revealConfirmButton, setRevealConfirmButton] = useState(false);
  const deleteFetcher = useFetcher();
  const orgRole = fetcher.formData?.get('orgRole') ?? member.orgRole;

  function handleRemove(event) {
    setRevealConfirmButton((prevReveal) => !prevReveal);
  }

  useEffect(() => {
    if (deleteFetcher.state === 'idle' && deleteFetcher.data?.error) {
      setRevealConfirmButton(false);
    }
  }, [deleteFetcher.state, deleteFetcher.data]);

  return (
    <tr>
      <td>{member.name}</td>
      <td>{member.email}</td>
      <td>
        <fetcher.Form method="patch">
          <input type="hidden" name="userId" value={member.userId} />
          <select
            name="orgRole"
            value={orgRole}
            disabled={fetcher.state !== 'idle'}
            onChange={(e) => fetcher.submit(e.currentTarget.form, { method: 'patch' })}
          >
            <option value="MEMBER">Member</option>
            <option value="ORG_ADMIN">Org Admin</option>
          </select>
          {fetcher.data?.error && <p className="error">{fetcher.data.error}</p>}
        </fetcher.Form>
      </td>
      <td>
        <deleteFetcher.Form method="delete">
          <input type="hidden" name="userId" value={member.userId} />
          {!revealConfirmButton && (
            <button type="button" onClick={handleRemove} className="link-button member-delete-btn">
              Delete
            </button>
          )}
          {revealConfirmButton && (
            <button type="submit" className="link-button member-confirm-delete-btn">
              Confirm Delete
            </button>
          )}
          {revealConfirmButton && (
            <button type="button" onClick={handleRemove} className="link-button member-cancel-btn">
              Cancel
            </button>
          )}
          {deleteFetcher.data?.error && <p className="error">{deleteFetcher.data.error}</p>}
        </deleteFetcher.Form>
      </td>
    </tr>
  );
}
