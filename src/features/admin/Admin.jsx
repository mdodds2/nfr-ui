import { useNavigate } from 'react-router-dom';

export default function AdminPage() {
  const navigate = useNavigate();

  return (
    <main>
      <section>
        <article>
          <h1>Admin</h1>
          <div className="tile-container">
          <button className="tile-button" onClick={() => navigate('/organizations')}>
            Organization Admin
          </button>
          <button className="tile-button" onClick={() => navigate('/users')}>
            User Admin
          </button>
          <button className="tile-button" onClick={() => navigate('/requirements/displayAll')}>
            Quality Attribute Admin
          </button>
          </div>
        </article>
      </section>
    </main>
  );
}
