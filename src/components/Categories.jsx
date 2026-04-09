import { useLoaderData } from 'react-router-dom';

import CategoriesSub from './CategoriesSub.jsx';

export default function Categories() {

    const categories = useLoaderData();

    function fetchSubcategoryDescription(id) {
        document.getElementById('preview-placeholder').innerHTML = document.getElementById('sc_' + id).innerHTML;
    }
    function restoreHome(desc) {
        document.getElementById('preview-placeholder').innerHTML = document.getElementById('preview-home').innerHTML;
    }

    return(
        <>
            <div id='preview-home' className='hidden'>
                <p>Furps+ is the shit.</p>
                <br/><br/>
                <ul>
                    { categories.map( (category) => 
                        <li key={category.id}>{category.name}</li> 
                    )}
                </ul>
            </div>

            <div key={'home'} className="field-item" onClick={restoreHome}>Home</div> 
            { categories && categories.map( (category) => 
                <div key={category.id} className="field-item" onClick={() => fetchSubcategoryDescription(category.id)}>{category.name}</div> 
            )}

            { categories && categories.map( (category) => 
                <div key={`sc_${category.id}`} id={`sc_${category.id}`} className="hidden">
                    <CategoriesSub id={category.id} />
                </div> 
            )}

        </>
    );
}

