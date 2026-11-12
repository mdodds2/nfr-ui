import { useLoaderData } from "react-router-dom";
import RequirementForm from "../components/RequirementForm.jsx";

export default function DeleteRequirement() {
    const data = useLoaderData();
    return (
        <main className="main-content">
            <section className="preview-area">
                <RequirementForm requirement={data} mode="delete" />
            </section>
        </main>
    );
}


