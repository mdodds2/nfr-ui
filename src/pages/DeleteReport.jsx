import { Link } from "react-router-dom";

export default function DeleteReport() {
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
