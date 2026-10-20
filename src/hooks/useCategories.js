import { useEffect, useState } from "react";
import { getCategories } from "../util/http";

export default function useCategories() {

    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorText, setErrorText] = useState(null)

    useEffect(() => {
        async function load() {

            try {
                setCategories(await getCategories());
            }
            catch {
                setErrorText('Something went wrong when loading Categories');
            }
            finally {
                setIsLoading(false);
            }
        }
        load();
    }, []);
    
    return {categories, isLoading, errorText};
}