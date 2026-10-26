import { NavLink } from "react-router-dom";

export default function LogoutPage() {

    return (
        <main>
            <h1>Logged out.</h1>
            <NavLink to="/">Log in again</NavLink>
        </main>
    );
}

