import { useState } from "react";
import { useRouteLoaderData } from 'react-router-dom';

import HamburgerComponent from "./HamburgerComponent.jsx";
import { useOrg } from '../store/org-context-object.js';
import UserProfile from "../features/users/UserProfile.jsx";
import Modal from "./Modal.jsx";
import OrgPicker from "../features/orgs/OrgPicker.jsx";

export default function NavBar() {

    const [showProfile, setShowProfile] = useState(false);
    const currentUser = useRouteLoaderData('auth');
    const { orgs } = useOrg();

    function getInitials(userName) {
        if (!userName) return "";
        return userName.split(" ").map(p => p.charAt(0)).join("");
    }

    return <nav className="navbar">
        <div className="nav-left">
            <HamburgerComponent />

            <div className="logo">
                <a href="/main"><img src="/logo.png" alt="QA Logo"/></a>
            </div>

            <div className="nav-title">
                <h2>{import.meta.env.VITE_APP_TITLE}</h2>
            </div>

        </div>

        <div className="nav-right">
            { orgs.length === 1 && <span>{orgs[0].name}</span> }
            { orgs.length > 1 && <OrgPicker /> }
            <div className="initials-circle" onClick={() => setShowProfile(true)}>{getInitials(currentUser.name)}</div>
        </div>

        <Modal isOpen={showProfile} onClose={() => setShowProfile(false)} >
            <UserProfile />
            <div className="center-container">
                <p className="link-button-green-mlblue" onClick={() => setShowProfile(false)}>Close</p>
            </div>
        </Modal>

    </nav>
}
