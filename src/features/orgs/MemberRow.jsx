import { useFetcher } from 'react-router-dom';

export default function MemberRow({ member }) {
  const fetcher = useFetcher();

  return (
    <tr>
      <td>{member.name}</td>
      <td>{member.email}</td>
      <td>
        <fetcher.Form method="patch">
          <input type="hidden" name="userId" value={member.userId} />
          <select
            name="orgRole"
            value={member.orgRole}
            disabled={fetcher.state !== 'idle'}
            onChange={(e) => fetcher.submit(e.currentTarget.form, { method: 'patch' })}
          >
            <option value="MEMBER">Member</option>
            <option value="ORG_ADMIN">Org Admin</option>
          </select>
          {fetcher.data?.error && <p className="error">{fetcher.data.error}</p>}
        </fetcher.Form>
      </td>
    </tr>
  );
}
