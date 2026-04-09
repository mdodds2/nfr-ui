import { useLoaderData } from "react-router-dom";
import MainNavigation from "../components/MainNavigation";
import RequirementForm from "../components/RequirementForm";

export default function ProfilePage() {
    const data = useLoaderData();
    return (
        <main className="main-content">
            <MainNavigation />
            <section className="preview-area">
                <RequirementForm requirement={data} mode="readonly" />
            </section>
        </main>
    );}


