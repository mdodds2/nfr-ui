import { NavLink } from 'react-router-dom'

export default function CategoryWidget({category, current, handleClick}) {
  return (
    <nav>
        <div className={current ? "loader-widget-selected" : "loader-widget"} >
            <a href="#" id={category.id} onClick={handleClick}>{category.name}</a>
        </div>
    </nav>
  )
}
