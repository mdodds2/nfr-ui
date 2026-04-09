import { useState, useRef } from 'react';
import { useEffectEvent } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getUserData, setAuthToken} from '../util/auth.js';

function UserInfo(props) {
    
    const userData = getUserData();

    const [dropdownToggle, setDropdownToggle] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const handleDropdownToggle = () => {
        setDropdownToggle(!dropdownToggle);
    }

    // detect outside click
    const handleClickOutside=(e) => {
        if(dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setDropdownToggle(false);
        }
    }

    useEffectEvent(() => {
        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function getInitials(userName) {
        var initials = "";
        var parts = userName.split(" ");
        parts.map((part, index, array) => {
            initials += part.charAt(0);
        });
        return initials;
    }

    function handleLogout() {
        setAuthToken(null);
        navigate('/logout');
    }

    return(
        <>
            <div className="relative-div" ref={dropdownRef}>
                <button type="button" className="user-profile" onClick={handleDropdownToggle}>
                    {getInitials(userData.name)}
                </button>
                <div className={`custom-profile-dropdown ${dropdownToggle ? ' active' : ''}`}>
                    <h3 className="menu-name">{userData.name}</h3>
                    <div className="menu-items-div">

                        <div className="menu-item">
                            <a href='/profile' className='menu-item-link'>Profile</a>
                        </div>

                        { userData.role === "ADMIN" && (
                            <div className="menu-item">
                                <NavLink to="/main/admin" className='menu-item-link'>Admin</NavLink>
                            </div>
                        )}

                        <div className="menu-item">
                            <NavLink to="/main/about" className='menu-item-link' >About</NavLink>
                        </div>

                        <div className="border-top">
                            <button type="button" className="menu-item logout" onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                </div>
            </div>

        </>

    );
}

export default UserInfo;