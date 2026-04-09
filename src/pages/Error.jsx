import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function ErrorPage() {

    const error = useRouteError();

    return <main>
        <h2>An error has occurred.</h2>
        <p>
            {/* Display a user-friendly message */}
            {isRouteErrorResponse(error) ? (
                <i>{error.statusText || error.message}</i>
            ) : (
                <i>{error.message || "Unknown error"}</i>
            )}
        </p>

        <a href="/main">Home</a>
    </main>;
}