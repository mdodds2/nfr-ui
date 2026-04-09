import HamburgerComponent from "../ui/HamburgerComponent.jsx";
import { getUserData } from "../util/auth.js";
import UserProfile from "../components/UserProfile.jsx";
import { useState } from "react";
import Modal from "./Modal.jsx";

export default function NavBar() {

    const userData = getUserData();
    const [showProfile, setShowProfile] = useState();

    function getInitials(userName) {
        var initials = "";
        var parts = userName.split(" ");
        parts.map((part, index, array) => {
            initials += part.charAt(0);
        });
        return initials;
    }

    return <nav className="navbar">
        <div className="nav-left">
            <HamburgerComponent />

            <div className="logo">
                <a href="/main"><img src="/logo.png" alt="QA Logo"/></a>
            </div>

            <div className="nav-title">
                <h2>Quality Attributes Test Plan Builder</h2>
            </div>

        </div>

        <div className="nav-right">
            <div className="initials-circle" onClick={() => setShowProfile(true)}>{getInitials(userData.name)}</div>
        </div>

        <Modal isOpen={showProfile} onClose={() => setShowProfile(false)} >
            <UserProfile />
            <div className="center-container">
                <p className="link-button-green-mlblue" onClick={() => setShowProfile(false)}>Close</p>
            </div>
        </Modal>
        
    </nav>
}
