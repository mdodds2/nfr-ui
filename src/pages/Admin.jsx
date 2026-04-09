import { Link, redirect, useNavigate } from "react-router-dom";

import MainNavigation from "../components/MainNavigation";

export default function AdminPage({ mode = 'default' }) {

    const navigate = useNavigate();

    function handleNavigate(dest) {
        navigate(dest);
    }

    return (
        <main>
            <section>

                {mode === 'default' && <article>
                    <h1>Admin</h1>

                    <button className="tile-button" onClick={() => handleNavigate('/requirements/displayAll')}>Show All NFRs</button>
                    <button className="tile-button" onClick={() => handleNavigate('/requirements/new')}>New NFR</button>

                </article> }

            </section>


        </main>
    );

}