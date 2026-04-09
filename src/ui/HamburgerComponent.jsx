import { useState } from "react"
import { Link } from "react-router-dom";

import Hamburger from 'hamburger-react';
import { getUserData } from "../util/auth.js";

export default function HamburgerComponent() {
    const [open, setOpen] = useState(false);

    function handleClick() {
        setOpen(false);
        return true;
    }

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
                {getUserData().role === 'ADMIN' && <li className="nav-item">
                    <Link to="/main/admin" onClick={handleClick}>Admin</Link>
                </li>}
                <li className="nav-item">
                    <Link to="/logout" onClick={handleClick}>Logout</Link>
                </li>
            </ul>}
        </nav>
    )
}


