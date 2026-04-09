import { useEffect, useState } from "react";
import { getAuthToken } from "../util/auth.js";

export default function useRequirementIdent(categoryId, subCategoryId) {

    const [identifier, setIdentifier] = useState();
    const [isLoading, setIsLoading] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        async function handleFetchIdentifier() {
            if (!categoryId || !subCategoryId) {
                setIdentifier(null);
                setIsLoading(false);
                setError(null);
                return { identifier, isLoading, error };

            } else {
                setIsLoading(true);
                setError(null);
                try {
                    const response = await fetch('http://localhost:8080/requirements/nextIdentifier/' + categoryId + '/' + subCategoryId, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'text/plain',
                            'Authorization': ' Bearer ' + getAuthToken(),
                        },
                    });
                    const data = await response.json();
                    setIdentifier(data.identifier);
                }
                catch (error) {
                    setIsLoading(false);
                    setError('Something went wrong when fetcing next identifier');
                    console.log(JSON.stringify(error));
                }
                finally {
                    setIsLoading(false);
                }
            }
        }

        handleFetchIdentifier();
    }, [])

    return { identifier, isLoading, error };
}
