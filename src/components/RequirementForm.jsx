import { useContext, useEffect, useState } from "react";
import { Form, Link, useActionData, useLoaderData } from "react-router-dom";

import { PRIORITY, STATUS} from '../util/constants.js';
import { getSubCategories, getNextIdentifier} from "../util/http.js";
import { DisplayContext } from "../store/display-context.jsx";


export default function RequirementForm( { mode, requirement } ) {

    const displayContext = useContext(DisplayContext);

    const actionData = useActionData();
    const categories = mode === 'new' ? useLoaderData() : null;
    const isReadOnly = mode === 'readonly' ? true : false;
    const [nextIdentifier, setNextIdentifier] = useState();

    useEffect(() => {
      async function fetchNextIdentifier() {
        const nextIdent = await getNextIdentifier(displayContext.categoryId, displayContext.subCategoryId);
        setNextIdentifier(nextIdent.identifier);
      }
      if(displayContext.subCategoryId && displayContext.setSubCategoryId) {
        fetchNextIdentifier();
      } else {
        setNextIdentifier(null);
      }
    }, [displayContext.subCategoryId])

    async function handleCategory(event) {
        const id = event.target.value;
        
        setNextIdentifier('');

        if (id === '') {
            displayContext.setCategoryId(null);
            displayContext.setSubCategoryId(null);
            displayContext.setSubCategories(null);
            return;
        }

        displayContext.setCategoryId(id);
        displayContext.setSubCategories(await getSubCategories(id));
    }

    function handleSubCategory(event) {
        const id = event.target.value;

        if (id === '') {
            return;
        }
        displayContext.setSubCategoryId(id);
    }

    return <article>
        <br />
        { mode === 'new' && <h2>Create a New Requirement</h2>}
        { mode === 'edit' && <h2>Edit an Existing Requirement</h2>}

        <Form method="POST" >

            {mode === 'new' && <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select id="category" name="category" onChange={handleCategory} required defaultValue={displayContext.categoryId == null ? '' : displayContext.categoryId}>
                    <option key="select" value="">Select</option>
                    {categories && categories.map((category) =>
                        <option key={category.id} value={category.id}>{category.name}</option>
                    )}
                </select>

                <label htmlFor="subCategory">Type *</label>
                <select id="subCategory" name="subCategory" onChange={handleSubCategory} required defaultValue={displayContext.subCategoryId == null ? '' : displayContext.subCategoryId}>
                    <option key="select" value="">Select</option>
                    {displayContext.categoryId && displayContext.subCategories && displayContext.subCategories.map((subCategory) =>
                        <option key={subCategory.id} value={subCategory.id}>{subCategory.name}</option>
                    )}
                </select>
            </div> }

            <div className="form-group">
                <label htmlFor="identifier">Identifier *</label>
                <input type="text" id="identifier" name="identifier" placeholder="PERF-2025-003" defaultValue={requirement ? requirement.identifier: nextIdentifier} readOnly={isReadOnly} ></input>

                <label htmlFor="title">Title *</label>
                <input type="text" id="title" name="title" placeholder="A title..." required defaultValue={requirement ? requirement.title : ''} readOnly={isReadOnly}></input>

                <label htmlFor="description">Description *</label>
                <input type="text" id="description" name="description" placeholder="A description..." required defaultValue={requirement ? requirement.description: ''} readOnly={isReadOnly}></input>

                <label htmlFor="priority">Priority *</label>
                <select id="priority" name="priority" required defaultValue={requirement ? requirement.priority : ''} disabled={isReadOnly}>
                    <option value="">Select</option> 
                    { PRIORITY.map(pri => <option key={pri} value={pri}>{pri}</option>)}
                </select>

                <label htmlFor="status">Status *</label>
                <select id="status" name="status" required defaultValue={requirement ? requirement.status : ''} disabled={isReadOnly}>
                    <option value="">Select</option> 
                    { STATUS.map(status => <option key={status} value={status}>{status}</option> )}
                </select>

                <label htmlFor="rationale">Rationale *</label>
                <input type="text" id="rationale" name="rationale" placeholder="business / risk / regulation reason" required defaultValue={requirement ? requirement.rationale : ''} readOnly={isReadOnly}></input> 

                <label htmlFor="source">Source *</label>
                <input type="text" id="source" name="source" placeholder="Stakeholder X, GDPR Art. 32, Competitor benchmark" required defaultValue={requirement ? requirement.source : ''} readOnly={isReadOnly}></input> 

                <label htmlFor="riskIfViolated">Risk If Violated *</label>
                <input type="text" id="riskIfViolated" name="riskIfViolated" placeholder="Identify risk if violated" required defaultValue={requirement ? requirement.riskIfViolated : ''} readOnly={isReadOnly}></input> 
            </div>

            { actionData && actionData.error && <p className="error">{actionData.error}</p> }

            { mode !== 'readonly' && <button className="btn btn-25">Save</button> }
            { mode !== 'readonly' && <Link className="link-button link-button-25" to="/main/admin">Cancel</Link> }
            { mode === 'readonly' && <Link className="link-button link-button-25" to="/requirements/displayAll">Back</Link> }
        </Form>
    </article>
}



