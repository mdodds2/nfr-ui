import { useContext, useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { getSubCategories, getRequirementsForSubCategory } from "../util/http";
import { DisplayContext } from "../store/display-context";

export default function Requirements() {

    const displayContext = useContext(DisplayContext);
    const categories = useLoaderData();
    const [requirements, setRequirements] = useState();

    useEffect(() => {
        (async () => {
            if(displayContext.subCategoryId) {
                const reqts = await getRequirementsForSubCategory(displayContext.subCategoryId);
                setRequirements(reqts);
            }
        })();
    }, []);

    async function handleCategory(event) {
        const id = event.target.value;

        if (id === '') {
            displayContext.setCategoryId(null);
            displayContext.setSubCategories(null);
            setRequirements(null);
            return;
        }

        displayContext.setCategoryId(id)
        displayContext.setSubCategories(await getSubCategories(id));
    }

    async function handleSubCategory(event) {
        const id = event.target.value;
        displayContext.setSubCategoryId(id);
        if (id === '') {
            setRequirements(null);
            return;
        }

        const reqts = await getRequirementsForSubCategory(id);
        setRequirements(reqts);
    }

    return <article>
        <br />
        <h1>Display Requirements</h1>
        <div className="form-group">

            <select id="category" name="category" onChange={handleCategory} required value={displayContext.categoryId == null ? '' : displayContext.categoryId}>
                <option key="select" value="">Select Category</option>
                {categories && categories.map((category) =>
                    <option key={category.id} value={category.id}>{category.name}</option>
                )}
            </select>
            &nbsp;
            <select id="subCategory" name="subCategory" onChange={handleSubCategory} required value={displayContext.subCategoryId == null ? '' : displayContext.subCategoryId}>
                <option key="select" value="">Select Type</option>
                {displayContext.categoryId && displayContext.subCategories && displayContext.subCategories.map((subCategory) =>
                    <option key={subCategory.id} value={subCategory.id}>{subCategory.name}</option>
                )}
            </select>
        </div>

        {requirements && requirements.length > 0 && <table>
            <thead>
                <tr>
                    <th>Action</th>
                    <th>Identifier</th>
                    <th>Title</th>
                    <th>Priority</th>
                    <th>Status</th>
                </tr>
            </thead>

            <tbody>

                {requirements.map((requirement) =>
                    <tr key={requirement.id}>
                        <td>
                            <Link className="link-button link-button-small" to={`/requirements/edit/${requirement.id}`}>Edit</Link>
                            <Link className="link-button link-button-small" to={`/requirements/edit/${requirement.id}`}>Delete</Link>
                        </td>
                        <td><Link to={`/requirements/display/${requirement.id}`}>{requirement.identifier}</Link></td>
                        <td>{requirement.title}</td>
                        <td>{requirement.priority}</td>
                        <td>{requirement.status}</td>
                    </tr>
                )}
            </tbody>

        </table>
        }

        { (!requirements || requirements.length == 0) && <p className="message">No requirements exist for the selected Category & Type </p> }
        
        { displayContext && displayContext.categoryId && displayContext.subCategoryId && <Link className="link-button link-button-25" to="/requirements/new">New</Link> }

    </article>
}