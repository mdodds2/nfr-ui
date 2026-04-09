import React, {useState, useEffect, useContext} from 'react';
import { LoginContext } from '../contexts/LoginContext.jsx';

function WelcomeUser() {

    const loginContext = useContext(LoginContext);

    return(
        <div>
            <p>Welcome, {loginContext.name}!</p>
        </div>
    );
}

export default WelcomeUser;