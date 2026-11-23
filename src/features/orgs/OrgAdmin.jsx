import { useLoaderData } from 'react-router-dom';

import Organizations from './Organizations.jsx';

export default function OrgAdmin() {
  const loaderData = useLoaderData();
  return (
    <main>
      <section>
        <h1>Org Admin Page</h1>
        <Organizations orgs={loaderData} />
      </section>
    </main>
  );
}
