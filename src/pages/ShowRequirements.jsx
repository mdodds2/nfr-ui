import MainNavigation from "../components/MainNavigation";
import Requirements from "../components/Requirements";

export default function ShowRequirements() {
    return (
        <main className="main-content">
            <MainNavigation />
            <section className="preview-area">
                <Requirements />
            </section>
        </main>
    );
}


