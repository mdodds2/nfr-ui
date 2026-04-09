import { useContext } from "react";
import { NavLink } from "react-router-dom";

import { DisplayContext } from "../store/display-context";
export default function LogoutPage() {

    const displayContext = useContext(DisplayContext);
    displayContext.setCategoryId(null);
    displayContext.setSubCategoryId(null);
    displayContext.setSubCategories(null);

    return (
        <main>
            <h1>Logged out.</h1>
            <NavLink to="/">Log in again</NavLink>
        </main>
    );
}

