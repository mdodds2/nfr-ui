import { useLoaderData } from "react-router-dom";
import RequirementForm from "../components/RequirementForm.jsx";

export default function EditRequirement() {
    const data = useLoaderData();
    return (
        <main className="main-content">
            <section className="preview-area">
                <RequirementForm requirement={data} mode="edit" />
            </section>
        </main>
    );
}


