import { useLoaderData } from "react-router-dom";

import UserProfile from "./UserProfile";
import ChangePassword from "../auth/ChangePassword";

export default function ProfilePage() {
    const orgs = useLoaderData();

    return (
        <main>
            <section>
                <UserProfile orgs={orgs}/>
                <ChangePassword />
            </section>
        </main>
    );
}