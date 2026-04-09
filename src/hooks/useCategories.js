import { useEffect, useState } from "react";
import { getAuthToken } from "../util/auth";

export default function useCategories() {

    const [categories, setCategories] = useState();
    const [isLoading, setIsLoading] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        async function handleFetchCategories() {

            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch('http://localhost:8080/categories', {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'text/plain',
                    'Authorization': ' Bearer ' + getAuthToken(),
                    },
                });
                const data = await response.json();
                setCategories(data);
            }
            catch(error) {
                setError('Something went wrong when loading Categories');
            }
            finally {
                setIsLoading(false);
            }
        
        }
        handleFetchCategories();
    }, []);
    
    return {categories, isLoading, error};
}