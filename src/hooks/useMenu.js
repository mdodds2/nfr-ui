import { useState } from "react";

export default function useMenu() {
 
    const [currentItem, setCurrentItem] = useState([]);

    return { currentItem, setCurrentItem};
}