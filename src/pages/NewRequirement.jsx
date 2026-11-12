import { useLoaderData } from "react-router-dom";

import RequirementForm from "../components/RequirementForm";

export default function NewRequirement() {

    const loaderData = useLoaderData();

    return (
        <main className="main-content">
            <section className="preview-area">
                <RequirementForm mode="new" categories={loaderData.categories} initialIdentifier={loaderData.nextIdentifier} />
            </section>
        </main>
    );
}

