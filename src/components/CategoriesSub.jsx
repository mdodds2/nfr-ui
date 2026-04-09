import {useState, useEffect} from 'react';

import { getCategory, getSubCategories } from '../util/http.js';
import Tile from '../ui/Tile.jsx';
import Category from '../ui/Category.jsx';

function CategoriesSub({categoryId}) {

    const [isLoading, setIsLoading] = useState(true);
    const [category, setCategory] = useState(null);
    const [subCategories, setSubCategories] = useState(null);

    useEffect( () => {
        async function fetchCategoryData() {
            const categoryResp = await getCategory(categoryId);
            setCategory(categoryResp);

            const subCategoriesResp = await getSubCategories(categoryId);
            setSubCategories(subCategoriesResp);
            setIsLoading(false);
        }

        fetchCategoryData();
    }, [categoryId]);


    return(
    <>
        <br/>
        {category && <div>
            <h2>Category: {category.name}</h2>
            <br/>
            <p>{category.description}</p>
        </div>}
        <br/>
        This category has the following subcategories:
        <br/>
        <br/>

        {!isLoading && subCategories && subCategories.map( (subCategory) => 
            <div className="box-container">
                <Category 
                    key={subCategory.id}
                    id={subCategory.id}
                    title={subCategory.name}
                    image="/Sub-Characteristic.jpg"
                />
            </div>
        )}



        <table>
        <tbody>
        {!isLoading && subCategories && subCategories.map( (subCategory) => 
            <tr key={subCategory.id}>
                <td><b>{subCategory.name}:</b></td>
                <td>{subCategory.description}</td>
            </tr>
        )}
        </tbody>
        </table>

    </>);
}

export default CategoriesSub;