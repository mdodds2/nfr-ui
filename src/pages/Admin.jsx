import { useNavigate } from 'react-router-dom';

export default function AdminPage() {
  const navigate = useNavigate();

  return (
    <main>
      <section>
        <article>
          <h1>Admin</h1>

          <button className="tile-button" onClick={() => navigate('/requirements/displayAll')}>
            Show All NFRs
          </button>
          <button className="tile-button" onClick={() => navigate('/requirements/new')}>
            New NFR
          </button>
        </article>
      </section>
    </main>
  );
}
