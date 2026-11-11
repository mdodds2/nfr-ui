import { useLoaderData } from 'react-router-dom';
import MainNavigation from '../components/MainNavigation';
import RequirementForm from '../components/RequirementForm';

export default function ShowRequirement() {
  const data = useLoaderData();
  return (
    <main className="main-content">
      <h1>Quality Attribute</h1>
      <section className="preview-area">
        <RequirementForm requirement={data} mode="readonly" />
      </section>
    </main>
  );
}
