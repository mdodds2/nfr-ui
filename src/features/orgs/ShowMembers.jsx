import { useRef, useEffect } from 'react';
import { Link, useLoaderData, Form, useActionData, useNavigation } from 'react-router-dom';

import { useOrg } from '../../store/org-context-object.js';
import MemberRow from './MemberRow.jsx';

export default function ShowMembers() {
  const formRef = useRef(null);

  const members = useLoaderData();
  const { orgs, currentOrgId } = useOrg();
  const orgName = orgs.find((o) => o.id === currentOrgId)?.name;

  const actionData = useActionData();
  const navigation = useNavigation();
  const submitting = navigation.state === 'submitting';

  useEffect(() => {
    if (actionData?.ok) formRef.current?.reset();
  }, [actionData]);

  return (
    <main>
      <section>
        <article>
          <h1>Members - {orgName}</h1>

          <div className="button-row">
            <Form ref={formRef} method="post" className="add-member">
              <input
                type="email"
                name="email"
                placeholder="user@example.com"
                pattern=".+@.+\..+"
                required
              />
              <select name="orgRole" defaultValue="MEMBER">
                <option value="MEMBER">Member</option>
                <option value="ORG_ADMIN">Org Admin</option>
              </select>
              <button className="link-button" type="submit" disabled={submitting}>
                {submitting ? 'Adding…' : 'Add member'}
              </button>
              {actionData?.error && <p className="error">{actionData.error}</p>}
            </Form>
          </div>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Org Role</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <MemberRow key={m.userId} member={m} />
              ))}
            </tbody>
          </table>
          <Link className="link-button link-button-25" to="/main/admin">
            Back to Admin
          </Link>
        </article>
      </section>
    </main>
  );
}
