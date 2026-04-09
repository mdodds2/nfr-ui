import { NavLink } from "react-router-dom";

import { getUserData } from "../util/auth";


export default function MainNavigation() {
    return (
        <nav className="sidebar">
            <a href="/main" className="link-button">Home</a>
            <NavLink to="/reports" className="link-button">Reports</NavLink>
            <NavLink to="/main/profile" className="link-button">Profile</NavLink>
            <NavLink to="/main/about" className="link-button">About</NavLink>
            {getUserData().role == 'ADMIN' &&
                <NavLink to="/main/admin" className="link-button">Admin</NavLink>
            }
            <NavLink to="/logout" className="link-button">Logout</NavLink>
        </nav>
    );

    
}