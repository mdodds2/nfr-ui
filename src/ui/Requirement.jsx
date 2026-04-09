export default function Requirement({ id, title, caption, image, alt, height = "100", width = "100", isAdded, children }) {

  const styleName = isAdded ? "requirement-tile-selected" : "requirement-tile";

  return (
    <article className={styleName}>
      <div className="tile-title">
        <p className="tile-title">{title}</p>

        <div className="center-container">
          <div className="circle-text">{caption}</div>
        </div>

        {children}
      </div>
    </article>
  )
}
