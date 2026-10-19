import { redirect } from "react-router-dom";
import CredentialsForm from "../components/CredentialsForm";

export default function ForgotPage() {
    return <CredentialsForm mode="forgot" />;
}

export async function action({ request }) {
    // Placeholder -- pending issue
    return redirect('/');

}
