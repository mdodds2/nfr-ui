import { Link } from "react-router-dom";

export default function Tile( {id, title, image, alt, caption, handleClick}) {
  return (
    <article className="article-tile" onClick={handleClick}>
        <img src={image} alt={alt} width="75%" />
        <p className="tile-title">{title}</p>
        <p className="tile-caption">{caption}</p>

        <div className="center-container">  
          <Link target="_new" className="link-button link-button-small" to={`/reports/display/${id}`}>View</Link>
          <Link className="link-button link-button-small" to={`/reports/edit/${id}`}>Update</Link>
        </div>

    </article>
  )
}
