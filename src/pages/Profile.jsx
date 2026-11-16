import { useLoaderData } from "react-router-dom";

import UserProfile from "../components/UserProfile";
import ChangePassword from "../components/ChangePassword";

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