import { Children } from "react";
import { useMenuContext } from "../store/useMenuContext";

function MenuItem({ id, parent, text, handleClick, children }) {

    const { parentItem, setParentItem, childItem, setChildItem } = useMenuContext();
    const hasChildren = Children.count(children) > 0;

    const isActive = hasChildren ? parentItem === id : childItem === id;
    const showChildren = hasChildren && isActive;


    function localHandleClick() {
        if(id === 'home') {
            setParentItem(null);
            setChildItem(null);
        } else if(hasChildren){
            setParentItem(isActive ? null : id);
        } else {
            setChildItem(isActive ? null : id);
        }
        handleClick();
    }

    return (
        <div className="menu-item-container">
            <div onClick={localHandleClick}>
                <span className="menu-item">
                    { id === parent && !showChildren && <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg> }
                    { id === parent && showChildren && <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" /></svg> }
                    { id !== parent && <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m424-312 282-282-56-56-226 226-114-114-56 56 170 170ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg> }
                    {text.length > 40 ? text.substring(0, 40) + "..." : text}
                </span>
            </div>

            {showChildren && <div>
                {children}
            </div> }

        </div>
    )
}

export default MenuItem