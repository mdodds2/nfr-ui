import { getUserData } from "../util/auth";

export default function UserProfile() {

    const userData = getUserData();

    const expiry = new Date(userData.expiry * 1000).toLocaleString();

    const window = (userData.expiry * 1000 - Date.now() ) / 1000 / 60;
    
    return (

        <article>
            <h1>User Profile</h1>
            <br/>
            <table>
                <thead>
                    <tr>
                        <th>User Attribute</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>System id:</td>
                        <td>{userData.id}</td>
                    </tr>
                    <tr>
                        <td>Name:</td>
                        <td>{userData.name}</td>
                    </tr>
                    <tr>
                        <td>Email:</td>
                        <td>{userData.email}</td>
                    </tr>
                    <tr>
                        <td>Role:</td>
                        <td>{userData.role}</td>
                    </tr>
                    <tr>
                        <td>Last Logged In:</td>
                        <td>{new Date(userData.lastLoggedIn * 1000).toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td>Login Expiry:</td>
                        <td>{ expiry }</td>
                    </tr>
                </tbody>
            </table>
        </article>

    );
}