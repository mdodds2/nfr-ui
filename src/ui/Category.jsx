export default function Category( {title, handleClick, current, inCart }) {

  let className = "interactive-box";
  if(current) {
    className = className + " current-interactive-box";
  }
  const checkMark = <>&#10004;</>

  return (
    <div onClick={handleClick} className={className}>{title}  { inCart ? checkMark : "" }</div>
  )
}
