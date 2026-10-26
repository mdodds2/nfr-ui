import { NavLink } from "react-router-dom";

export default function Header() {
    
    return <div className="header">
        <h1>{import.meta.env.VITE_APP_TITLE}</h1>
      </div>

}