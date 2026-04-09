import { Link } from "react-router-dom";
import MainNavigation from "../components/MainNavigation";

export default function ProfilePage() {
    return (
        <main>
            <section>
                <article>
                    <h1>Report Deleted</h1>
                    <Link to="/reports">Back to Reports</Link>
                </article>
            </section>
        </main>
    );
}
