import { NavLink } from "react-router-dom";

export default function Header() {
    
    return <div className="header">
        <h1>{import.meta.env.VITE_SWAGGER_URL}Quality Attributes Report Builder</h1>
      </div>

}