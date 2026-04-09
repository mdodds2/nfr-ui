import { Fragment, useContext } from "react";
import { DisplayContext } from "../store/display-context";

export default function BoxLink( {id, selected, handleClick, children}) {

  const displayContext = useContext(DisplayContext);

  const isSelected = selected.includes(id);
  const isCurrent = id === displayContext.categoryId || id === displayContext.subCategoryId;

  let myClassName = 'box';
  if(isSelected && isCurrent) {
    myClassName = "selected-and-current-box";
  } else {
    if(isSelected) {
      myClassName = "selected-box";
    } else {
      if(isCurrent) {
        myClassName = "current-box";
      }
    }
  }
  return <a className={myClassName} href="#" onClick={() => handleClick(id)}>
        {children}
    </a>
}
