import MainNavigation from "../components/MainNavigation";
import RequirementForm from "../components/RequirementForm";

export default function NewRequirement() {
    return (
        <main className="main-content">
            <MainNavigation />
            <section className="preview-area">
                <RequirementForm mode="new" />
            </section>
        </main>
    );
}

