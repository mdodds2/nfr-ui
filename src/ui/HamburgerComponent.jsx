import { useState } from "react";
import { Link, useRouteLoaderData } from "react-router-dom";

import Hamburger from 'hamburger-react';
import { useOrg } from "../store/org-context-object.js";

export default function HamburgerComponent() {
    const [open, setOpen] = useState(false);

    function handleClick() {
        setOpen(false);
    }

    const currentUser = useRouteLoaderData('auth');
    const { orgs, currentOrgId } = useOrg();
    const isOrgAdmin = orgs.find(org => org.id === currentOrgId)?.orgRole === 'ORG_ADMIN';
    const showAdminLink = isOrgAdmin ||  currentUser.role === 'ADMIN';

    return (
        <nav>
            <Hamburger
                size={18}
                toggled={open}
                toggle={setOpen}
            />

            {open && <ul className="nav">
                <li className="nav-item">
                    <Link to="/main" onClick={handleClick}>Home</Link>
                </li>
                <li className="nav-item">
                    <Link to="/reports" onClick={handleClick}>Reports</Link>
                </li>
                <li className="nav-item">
                    <Link to="/main/profile" onClick={handleClick}>Profile</Link>
                </li>
                <li className="nav-item">
                    <Link to="/main/about" onClick={handleClick}>About</Link>
                </li>
                {showAdminLink && <li className="nav-item">
                    <Link to="/main/admin" onClick={handleClick}>Admin</Link>
                </li>}
                <li className="nav-item">
                    <Link to="/logout" onClick={handleClick}>Logout</Link>
                </li>
            </ul>}
        </nav>
    )
}


