import { jwtDecode } from "jwt-decode";
import { redirect } from "react-router-dom";

export function setAuthToken(token) {
    if(!token) {
        localStorage.removeItem('token');
    } else {
        localStorage.setItem('token', token);
    }
}

export function logout() {
    localStorage.removeItem('token');
}

export function getAuthToken() {
    return localStorage.getItem('token');
}

export function getUserData() {

    const token = getAuthToken();

    if(!token || token === null || token === 'null' || token === undefined) {
        return { noAuth: true};
    }
        
    const decodedToken = jwtDecode(token);
    return {
        id: decodedToken.sub,
        name: decodedToken.name,
        email: decodedToken.email,
        role: decodedToken.role,
        lastLoggedIn: decodedToken.iat,
        expiry: decodedToken.exp,
    }
}

export function checkAuthLoader() {
    const token = getAuthToken();
    if(!token) {
        return redirect("/");
    }
}