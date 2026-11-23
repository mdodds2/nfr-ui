import { Link, useRouteLoaderData, useNavigate } from "react-router-dom";

import { useOrg } from "../../store/org-context-object.js";

export default function AdminPage() {
  const navigate = useNavigate();

  const currentUser = useRouteLoaderData('auth');
  const isPlatformAdmin =  currentUser.role === 'ADMIN';

  const { orgs, currentOrgId } = useOrg();
  const isOrgAdmin = orgs.find(org => org.id === currentOrgId)?.orgRole === 'ORG_ADMIN';

  return (
    <main>
      <section>
        <article>
          <h1>Admin</h1>
          <div className="tile-container">

         { isOrgAdmin && <button className="tile-button" onClick={() => navigate('/organizations/' + currentOrgId + '/members')}>
            Members
          </button> }

         { isOrgAdmin && <button className="tile-button" onClick={() => navigate('/organizations')}>
            Organization Settings
          </button> }

          { isPlatformAdmin && <button className="tile-button" onClick={() => navigate('/users')}>
            User Admin
          </button> }

          { isPlatformAdmin && <button className="tile-button" onClick={() => navigate('/requirements/displayAll')}>
            Quality Attribute Admin
          </button> }

          </div>
        </article>
      </section>
    </main>
  );
}


