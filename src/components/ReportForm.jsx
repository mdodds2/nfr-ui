import { useContext, useEffect, useRef, useState } from "react";
import { Form, Link, useActionData, useLoaderData, useNavigate } from "react-router-dom";
import { DisplayContext } from "../store/display-context";
import { getRequirementsForSubCategory } from "../util/http.js";
import { deleteReport } from "../util/http.js";
import Category from "../ui/Category.jsx";
import Requirement from "../ui/Requirement.jsx";
import Modal from "../ui/Modal.jsx";
import CartContext from "../store/cart-context.jsx";
import Cart from "./Cart.jsx";

export default function ReportForm({ mode }) {

    const actionData = useActionData();
    const loaderData = useLoaderData();

    const navigate = useNavigate();

    const displayContext = useContext(DisplayContext);
    const cartContext = useContext(CartContext);

    const id = useRef();
    const targetValue = useRef();
    const thresholdValue = useRef();
    const unit = useRef();
    const measurementMethod = useRef();
    const trigger = useRef();
    const context = useRef();
    const systemResponse = useRef();
    const owner = useRef();
    const acceptanceCriteria = useRef();
    const notes = useRef();

    const defaultFormValues = {
        "id": "",
        "targetValue": "",
        "thresholdValue": "",
        "unit": "",
        "measurementMethod": "",
        "trigger": "",
        "context": "",
        "systemResponse": "",
        "owner": "",
        "acceptanceCriteria": "",
        "notes": "",
    }

    const [requirements, setRequirements] = useState([]);
    const [currentRequirement, setCurrentRequirement] = useState();
    const [fieldError, setFieldError] = useState({ field: '', message: '' });
    const [formValues, setFormValues] = useState(defaultFormValues)

    const [open, setOpen] = useState(false);
    const [showCart, setShowCart] = useState(false);

    useEffect(() => {
        async function fetchRequirements(subCategoryId) {
            const reqs = await getRequirementsForSubCategory(subCategoryId);
            setRequirements(reqs);
        }

        setRequirements([]);
        if (displayContext.categoryId && displayContext.subCategoryId) {
            fetchRequirements(displayContext.subCategoryId);
        }

    }, [displayContext.categoryId, displayContext.subCategoryId]);

    useEffect(() => {
        cartContext.clearCart();
        
        if (loaderData && loaderData.report && loaderData.report.measurements) {
            loaderData.report.requirements.forEach( (requirement) => {
                
                const category = findCategoryBySubCategoryId(loaderData.categories, requirement.subCategoryId);
                const subCategory = findSubCategory(category.subCategories, requirement.subCategoryId);
                const measurement = loaderData.report.measurements.find(m => m.requirementId === requirement.id);

                const item = {
                    "requirement": requirement,
                    "category": category,
                    "subCategory": subCategory,

                    "id": measurement.id ?? "",
                    "targetValue": measurement.targetValue ?? "",
                    "thresholdValue": measurement.thresholdValue ?? "",
                    "unit": measurement.unit ?? "",
                    "measurementMethod": measurement.measurementMethod ?? "",
                    "trigger": measurement.trigger ?? "",
                    "context": measurement.context ?? "",
                    "systemResponse": measurement.systemResponse ?? "",
                    "owner": measurement.owner ?? "",
                    "acceptanceCriteria": measurement.acceptanceCriteria ?? "",
                    "notes": measurement.notes ?? ""
                };
                cartContext.addItem(item);
            });
        }
    }, []);

    function handleCategory(categoryId) {
        displayContext.setCategoryId(categoryId);
        displayContext.setSubCategoryId(null);
        const category = loaderData.categories.find(c => c.id === categoryId);
        displayContext.setSubCategories(category.subCategories);
    }

    async function handleSubCategory(subCategoryId) {
        displayContext.setSubCategoryId(subCategoryId);
    }

    function handleDelete() {
        if (confirm("You have requested to delete this report.  Please confirm.")) {
            deleteReport(loaderData.report.id);
            navigate("/reports/delete");
        }
        return false;
    }

    function cartHasRequirement(id) {
        const items = cartContext.items.filter(i => i.requirement.id === id);
        return items.length > 0;
    }

    function cartHasCategory(id) {
        return cartContext.items.find(i => i.category.id === id) !== undefined;
    }

    function cartHasSubCategory(id) {
        return cartContext.items.find(i => i.subCategory.id === id) !== undefined;
    }

    function handleSelectRequirement(reqtId) {
        setOpen(true);

        setFormValues({
            "id": "",
            "targetValue": "",
            "thresholdValue": "",
            "unit": "",
            "measurementMethod": "",
            "trigger": "",
            "context": "",
            "systemResponse": "",
            "owner": "",
            "acceptanceCriteria": "",
            "notes": ""
        });

        const requirment = requirements.filter(r => r.id === reqtId);
        setCurrentRequirement(requirment[0]);
    }

    function handlePrepareUpdateRequirement(reqtId) {

        const existingCartItemIndex = cartContext.items.findIndex(item => item.requirement.id === reqtId);

        if (existingCartItemIndex > -1) {
            const existingItem = cartContext.items[existingCartItemIndex];
            setFormValues({
                "id": existingItem.id,
                "targetValue": existingItem.targetValue,
                "thresholdValue": existingItem.thresholdValue,
                "unit": existingItem.unit,
                "measurementMethod": existingItem.measurementMethod,
                "trigger": existingItem.trigger,
                "context": existingItem.context,
                "systemResponse": existingItem.systemResponse,
                "owner": existingItem.owner,
                "acceptanceCriteria": existingItem.acceptanceCriteria,
                "notes": existingItem.notes
            });
        }

        const requirement = requirements.filter(r => r.id === reqtId);
        setCurrentRequirement(requirement[0]);

        setOpen(true);
    }

    function handleUpdateRequirement(reqtId) {
        return handleRequirement(reqtId, true);
    }

    function handleAddRequirement(reqtId) {
        return handleRequirement(reqtId, false);
    }

    function handleRequirement(reqtId, isUpdate) {

        if (systemResponse.current.value === '') {
            setFieldError({ field: 'systemResponse', message: 'System Response is a mandatory field' });
            return;
        }

        if (owner.current.value === '') {
            setFieldError({ field: 'owner', message: 'Owner is a mandatory field' });
            return;
        }

        if (acceptanceCriteria.current.value === '') {
            setFieldError({ field: 'acceptanceCriteria', message: 'Acceptance Criteria is a mandatory field' });
            return;
        }

        const category = loaderData.categories.find(c => c.id === displayContext.categoryId);
        const subCategory = displayContext.subCategories.find(c => c.id === displayContext.subCategoryId);
        const requirement = requirements.find(r => r.id === reqtId);

        const item = {
            "requirement": requirement,
            "category": category,
            "subCategory": subCategory,

            "id": id.current.value,
            "targetValue": targetValue.current.value,
            "thresholdValue": thresholdValue.current.value,
            "unit": unit.current.value,
            "measurementMethod": measurementMethod.current.value,
            "trigger": trigger.current.value,
            "context": context.current.value,
            "systemResponse": systemResponse.current.value,
            "owner": owner.current.value,
            "acceptanceCriteria": acceptanceCriteria.current.value,
            "notes": notes.current.value
        };

        if (isUpdate) {
            cartContext.removeItem(item);
        }
        cartContext.addItem(item);

        setOpen(false);
        setFieldError({ field: '', message: '' });
        setCurrentRequirement(null);
    }

    function handleRemoveRequirement(reqtId) {
        setCurrentRequirement(null);
        cartContext.removeItem(reqtId);
    }

    function handleHome() {
        displayContext.setCategoryId(null);
        displayContext.setSubCategoryId(null);
        displayContext.setSubCategories([]);
    }

    function handleClose() {
        setOpen(false);
        setFieldError({ field: '', message: '' });
    }

    function findCategoryName(id) {
        const category = loaderData.categories.filter(c => c.id === id);
        if (category.length > 0)
            return category[0].name;
        else
            return "Unknown Characteristic";
    }

    function findCategoryBySubCategoryId(categories, subCategoryId) {
        let category;
        categories.forEach( cat => {
            if(!category) {
                const subCategory = cat.subCategories.find(sc => sc.id === subCategoryId);
                if(subCategory) {
                    category = cat;;
                }   
            }
        });
        return category;
    }

    function findSubCategory(subCategories, id) {
        const subCategory = subCategories.filter(c => c.id === id);
        if (subCategory.length > 0)
            return subCategory[0];
        else
            return null;
    }

    function findSubCategoryName(subCategories, id) {
        const subCategory = findSubCategory(subCategories, id);
        if (subCategory)
            return subCategory.name;
        else
            return "Unknown Sub-Characteristic";
    }

    return <article>

        <div className="cart-container">
            <div className="cart-wrapper">
                <div className="pointer-container" onClick={() => setShowCart(true)}>
                    <img src="/cart.png" className="cart-icon" alt="Cart" />
                    <span className="cart-count">
                        {cartContext.items.length}
                    </span>
                </div>
            </div>
        </div>

        {mode === 'new' && <h2>Create a New Report</h2>}
        {mode === 'edit' && <h2>Edit an Existing Report</h2>}

        <Form method="POST" >

            <input type="hidden" id="id" name="id" defaultValue={formValues.id} ref={id}></input>

            <div className="form-group">
                <label htmlFor="title">Project Name *</label>
                <input type="text" id="title" name="title" placeholder="A title..." required defaultValue={loaderData.report ? loaderData.report.name : ''} ></input>

                <label htmlFor="description">Description *</label>
                <input type="text" id="description" name="description" placeholder="A description..." required defaultValue={loaderData.report ? loaderData.report.description : ''} ></input>

                <br />

                {displayContext.categoryId && !displayContext.subCategoryId && <p className="title"><a href="#" onClick={handleHome}>Home</a> / <a href="#" onClick={() => handleCategory(displayContext.categoryId)}>{findCategoryName(displayContext.categoryId)}</a></p>}
                {displayContext.categoryId && displayContext.subCategoryId && <p className="title"><a href="#" onClick={handleHome}>Home</a> / <a href="#" onClick={() => handleCategory(displayContext.categoryId)}>{findCategoryName(displayContext.categoryId)}</a> / {findSubCategoryName(displayContext.subCategories, displayContext.subCategoryId)}</p>}

                <div>
                    <p className="title">Characteristics:</p>
                    <div className="box-container">
                        {loaderData.categories && loaderData.categories.map((category) =>
                            <Category 
                                key={category.id} 
                                title={category.name} 
                                handleClick={() => handleCategory(category.id)} 
                                current={displayContext.categoryId === category.id}
                                inCart={cartHasCategory(category.id)} 
                            />
                        )}
                    </div>
                </div>

                {displayContext.subCategories && displayContext.subCategories.length > 0 && <div>
                    <p className="title">Sub-Characteristics:</p>
                    <div className="box-container">
                        {displayContext.subCategories && displayContext.subCategories.map((subCategory) =>
                            <Category 
                                key={subCategory.id} 
                                title={subCategory.name} 
                                handleClick={() => handleSubCategory(subCategory.id)} 
                                current={displayContext.subCategoryId === subCategory.id} 
                                inCart={cartHasSubCategory(subCategory.id)} 
                            />
                        )}
                    </div>
                </div>}
            </div>

            {requirements && requirements.length > 0 && <div>
                <p className="title">Quality Attributes:</p>
                <div className="center-container">
                    {requirements.map((requirement) =>
                        <Requirement
                            key={requirement.id}
                            title={requirement.identifier}
                            caption={requirement.title}
                            image="/QualityAttribute.jpg"
                            isAdded={cartHasRequirement(requirement.id)}
                            handleClick={() => handleSelectRequirement(requirement.id)}>
                            {!cartHasRequirement(requirement.id) && <a className="link-button-green" onClick={() => handleSelectRequirement(requirement.id)}>Add</a>}
                            {cartHasRequirement(requirement.id) && <a className="link-button-green" onClick={() => handlePrepareUpdateRequirement(requirement.id)}>Edit</a>}
                            {cartHasRequirement(requirement.id) && <a className="link-button-red" onClick={() => handleRemoveRequirement(requirement.id)}>Remove</a>}
                        </Requirement>
                    )}
                </div>
            </div>}

            <Modal isOpen={open} onClose={() => setOpen(false)} >
                <div className="report-form">
                    <p className="title">Add Quality Attribute to Report</p>
                    {currentRequirement && <div className="table">
                        <div className="table-row">
                            <div className="table-heading-fixed">Identifier:</div>
                            <div className="table-cell-fixed">{currentRequirement.identifier}</div>
                        </div>

                        <div className="table-row">
                            <div className="table-heading-fixed">Title:</div>
                            <div className="table-cell-fixed">{currentRequirement.title}</div>
                        </div>

                        <div className="table-row">
                            <div className="table-heading-fixed">Priority / Status:</div>
                            <div className="table-cell-fixed">{currentRequirement.priority} / {currentRequirement.status}</div>
                        </div>

                        <div className="table-row">
                            <div className="table-heading-fixed">Source:</div>
                            <div className="table-cell-fixed">{currentRequirement.source}</div>
                        </div>

                        <div className="table-row">
                            <div className="table-heading-fixed">Rationale:</div>
                            <div className="table-cell-fixed">{currentRequirement.rationale}</div>
                        </div>

                        <div className="table-row">
                            <div className="table-heading-fixed">Risk if Violated:</div>
                            <div className="table-cell-fixed">{currentRequirement.riskIfViolated}</div>
                        </div>

                        {fieldError.field === 'targetValue' && <div className="table-row">
                            <div className="table-heading-fixed"></div>
                            <div className="table-cell-fixed"><p className="error">{fieldError.message}</p></div>
                        </div>}
                        <div className="table-row">
                            <div className="table-heading-fixed"><label htmlFor="targetValue">Target Value</label></div>
                            <div className="table-cell-fixed"><input type="text" id="targetValue" name="targetValue" placeholder="Ideal or expected performance." defaultValue={formValues.targetValue} ref={targetValue}></input></div>
                        </div>

                        {fieldError.field === 'thresholdValue' && <div className="table-row">
                            <div className="table-heading-fixed"></div>
                            <div className="table-cell-fixed"><p className="error">{fieldError.message}</p></div>
                        </div>}
                        <div className="table-row">
                            <div className="table-heading-fixed"><label htmlFor="thresholdValue">Threshold Value</label></div>
                            <div className="table-cell-fixed"><input type="text" id="thresholdValue" name="thresholdValue" placeholder="Minimum acceptable performance." defaultValue={formValues.thresholdValue} ref={thresholdValue}></input></div>
                        </div>

                        {fieldError.field === 'unit' && <div className="table-row">
                            <div className="table-heading-fixed"></div>
                            <div className="table-cell-fixed"><p className="error">{fieldError.message}</p></div>
                        </div>}
                        <div className="table-row">
                            <div className="table-heading-fixed"><label htmlFor="unit">Unit</label></div>
                            <div className="table-cell-fixed"><input type="text" id="unit" name="unit" placeholder="What the value is measured in." defaultValue={formValues.unit} ref={unit}></input> </div>
                        </div>

                        {fieldError.field === 'measurementMethod' && <div className="table-row">
                            <div className="table-heading-fixed"></div>
                            <div className="table-cell-fixed"><p className="error">{fieldError.message}</p> </div>
                        </div>}
                        <div className="table-row">
                            <div className="table-heading-fixed"><label htmlFor="measurementMethod">Measurement Method</label></div>
                            <div className="table-cell-fixed"><input type="text" id="measurementMethod" name="measurementMethod" placeholder="How the value is verified." defaultValue={formValues.measurementMethod} ref={measurementMethod}></input> </div>
                        </div>

                        {fieldError.field === 'trigger' && <div className="table-row">
                            <div className="table-heading-fixed"></div>
                            <div className="table-cell-fixed"><p className="error">{fieldError.message}</p></div>
                        </div>}
                        <div className="table-row">
                            <div className="table-heading-fixed"><label htmlFor="trigger">Trigger</label></div>
                            <div className="table-cell-fixed"><input type="text" id="trigger" name="trigger" placeholder="What event or condition causes the system to respond?" defaultValue={formValues.trigger} ref={trigger}></input> </div>
                        </div>

                        {fieldError.field === 'context' && <div className="table-row">
                            <div className="table-heading-fixed"></div>
                            <div className="table-cell-fixed"><p className="error">{fieldError.message}</p></div>
                        </div>}
                        <div className="table-row">
                            <div className="table-heading-fixed"><label htmlFor="context">Context</label></div>
                            <div className="table-cell-fixed"><input type="text" id="context" name="context" placeholder="Where or under what conditions the scenario occurs." defaultValue={formValues.context} ref={context}></input> </div>
                        </div>

                        {fieldError.field === 'systemResponse' && <div className="table-row">
                            <div className="table-heading-fixed"></div>
                            <div className="table-cell-fixed"><p className="error">{fieldError.message}</p></div>
                        </div>}
                        <div className="table-row">
                            <div className="table-heading-fixed"><label htmlFor="trigger">System Response *</label></div>
                            <div className="table-cell-fixed"><input type="text" id="systemResponse" name="systemResponse" placeholder="What the system is expected to do when the stimulus occurs." required defaultValue={formValues.systemResponse} ref={systemResponse}></input> </div>
                        </div>

                        {fieldError.field === 'owner' && <div className="table-row">
                            <div className="table-heading-fixed"></div>
                            <div className="table-cell-fixed"><p className="error">{fieldError.message}</p></div>
                        </div>}
                        <div className="table-row">
                            <div className="table-heading-fixed"><label htmlFor="owner">Owner *</label></div>
                            <div className="table-cell-fixed"><input type="text" id="owner" name="owner" placeholder="Who is responsible for defining or validating the criteria." required defaultValue={formValues.owner} ref={owner}></input> </div>
                        </div>

                        {fieldError.field === 'acceptanceCriteria' && <div className="table-row">
                            <div className="table-heading-fixed"></div>
                            <div className="table-cell-fixed"><p className="error">{fieldError.message}</p></div>
                        </div>}
                        <div className="table-row">
                            <div className="table-heading-fixed"><label htmlFor="acceptanceCriteria">Acceptance Criteria *</label></div>
                            <div className="table-cell-fixed"><input type="text" id="acceptanceCriteria" name="acceptanceCriteria" placeholder="A simple boolean rule that determines success." required defaultValue={formValues.acceptanceCriteria} ref={acceptanceCriteria}></input> </div>
                        </div>

                        {fieldError.field === 'notes' && <div className="table-row">
                            <div className="table-heading-fixed"></div>
                            <div className="table-cell-fixed"><p className="error">{fieldError.message}</p></div>
                        </div>}
                        <div className="table-row">
                            <div className="table-heading-fixed"><label htmlFor="notes">Notes</label></div>
                            <div className="table-cell-fixed"><input type="text" id="notes" name="notes" placeholder="Additional commentary not captured above." defaultValue={formValues.notes} ref={notes}></input> </div>
                        </div>
                    </div>}

                    {currentRequirement && <div>
                        <br />
                        {!cartHasRequirement(currentRequirement.id) && <p className="link-button-green-big" onClick={() => handleAddRequirement(currentRequirement.id)}>Add to Report</p>}
                        {cartHasRequirement(currentRequirement.id) && <p className="link-button-green-big" onClick={() => handleUpdateRequirement(currentRequirement.id)}>Update</p>}
                        <p className="link-button-green-mlblue" onClick={handleClose}>Close</p>
                    </div>}
                </div>
            </Modal>

            <Modal isOpen={showCart} onClose={() => setShowCart(false)} >
                <Cart handleShowCart={setShowCart} requirements={requirements} />
            </Modal>

            {actionData && actionData.error &&
                <div>
                    <br />
                    <p className="error">{actionData.error}</p>
                </div>
            }

            <div className="container">
                {mode === 'new' && <button className="link-button link-button-25">Create Report</button>}
                {mode === 'edit' && <button className="link-button link-button-25">Update Report</button>}
                {mode === 'edit' && <a href="#" onClick={handleDelete} className="link-button link-button-25">Delete Report</a>}
            </div>

            {mode !== 'readonly' && <Link className="link-button link-button-25" to="/reports">Cancel</Link>}
            {mode === 'readonly' && <Link className="link-button link-button-25" to="/reports">Back</Link>}
        </Form>
    </article>
}



