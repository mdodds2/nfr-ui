import UserProfile from "../components/UserProfile";
import ChangePassword from "../components/ChangePassword";

export default function ProfilePage() {
    return (
        <main>
            <section>
                <UserProfile />
                <ChangePassword />
            </section>
        </main>
    );
}