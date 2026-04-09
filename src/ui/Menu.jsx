import { MenuProvider } from "../store/menu-context";

export default function Menu({ style, children }) {

    return (
        <div className={style}>
            <MenuProvider>
                {children}
            </MenuProvider>
        </div>
    )
}
