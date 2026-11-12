import { useContext, useState } from 'react';
import { Form, Link, useActionData } from 'react-router-dom';

import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../util/constants.js';
import { getSubCategories, getNextIdentifier } from '../util/http.js';
import { DisplayContext } from '../store/display-context-object';

export default function RequirementForm({
  mode,
  requirement = {},
  categories = [],
  initialIdentifier = '',
}) {
  const {
    categoryId,
    setCategoryId,
    subCategoryId,
    setSubCategoryId,
    subCategories,
    setSubCategories,
  } = useContext(DisplayContext);
  const [nextIdentifier, setNextIdentifier] = useState(initialIdentifier);

  const actionData = useActionData();

  const isReadOnly = mode === 'readonly' || mode === 'delete';

  async function handleCategory(event) {
    const id = event.target.value;
    setNextIdentifier('');
    setSubCategoryId(null);

    if (id === '') {
      setCategoryId(null);
      setSubCategories(null);
      return;
    }

    setCategoryId(id);
    setSubCategories(await getSubCategories(id));
  }

  async function handleSubCategory(event) {
    const id = event.target.value;

    if (id === '') {
      setNextIdentifier('');
      return;
    }
    setSubCategoryId(id);
    const next = await getNextIdentifier(categoryId, id);
    console.log(next);
    setNextIdentifier(next.identifier);
  }

  function handleSubmit(event) {
    if (mode === 'delete' && !confirm('Are you 100% sure?')) {
      event.preventDefault();
    }
  }

  return (
    <article>
      <br />
      {mode === 'new' && <h2>Create a New Requirement</h2>}
      {mode === 'edit' && <h2>Edit an Existing Requirement</h2>}
      {mode === 'delete' && <h2>Delete an Existing Requirement</h2>}

      <Form method="POST" onSubmit={handleSubmit}>
        {mode === 'new' && (
          <div className="form-group">
            <label htmlFor="category">Characteristic *</label>
            <select
              id="category"
              name="category"
              onChange={handleCategory}
              required
              defaultValue={categoryId == null ? '' : categoryId}
            >
              <option key="select" value="">
                Select
              </option>
              {categories &&
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>

            <label htmlFor="subCategory">Sub-Characteristic *</label>
            <select
              id="subCategory"
              name="subCategory"
              onChange={handleSubCategory}
              required
              defaultValue={subCategoryId == null ? '' : subCategoryId}
            >
              <option key="select" value="">
                Select
              </option>
              {categoryId &&
                subCategories &&
                subCategories.map((subCategory) => (
                  <option key={subCategory.id} value={subCategory.id}>
                    {subCategory.name}
                  </option>
                ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="identifier">Identifier *</label>
          <input
            type="text"
            id="identifier"
            name="identifier"
            placeholder="PERF-2025-003"
            value={requirement.identifier ?? nextIdentifier}
            readOnly
          />

          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="A title..."
            required
            defaultValue={requirement.title ?? ''}
            readOnly={isReadOnly}
          />

          <label htmlFor="description">Description *</label>
          <input
            type="text"
            id="description"
            name="description"
            placeholder="A description..."
            required
            defaultValue={requirement.description ?? ''}
            readOnly={isReadOnly}
          />

          <label htmlFor="priority">Priority *</label>
          <select
            id="priority"
            name="priority"
            required
            defaultValue={requirement.priority ?? ''}
            disabled={isReadOnly}
          >
            <option value="">Select</option>
            {PRIORITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <label htmlFor="status">Status *</label>
          <select
            id="status"
            name="status"
            required
            defaultValue={requirement.status ?? ''}
            disabled={isReadOnly}
          >
            <option value="">Select</option>
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <label htmlFor="rationale">Rationale *</label>
          <input
            type="text"
            id="rationale"
            name="rationale"
            placeholder="business / risk / regulation reason"
            required
            defaultValue={requirement.rationale ?? ''}
            readOnly={isReadOnly}
          />

          <label htmlFor="source">Source *</label>
          <input
            type="text"
            id="source"
            name="source"
            placeholder="Stakeholder X, GDPR Art. 32, Competitor benchmark"
            required
            defaultValue={requirement.source ?? ''}
            readOnly={isReadOnly}
          />

          <label htmlFor="riskIfViolated">Risk If Violated *</label>
          <input
            type="text"
            id="riskIfViolated"
            name="riskIfViolated"
            placeholder="Identify risk if violated"
            required
            defaultValue={requirement.riskIfViolated ?? ''}
            readOnly={isReadOnly}
          />
        </div>

        {actionData && actionData.error && <p className="error">{actionData.error}</p>}

        {['edit', 'new'].includes(mode) && <button className="btn btn-25">Save</button>}
        {mode === 'delete' && <button className="btn btn-25">Delete</button>}
        {mode !== 'readonly' && (
          <Link className="link-button link-button-25" to="/main/admin">
            Cancel
          </Link>
        )}
        {mode === 'readonly' && (
          <Link className="link-button link-button-25" to="/requirements/displayAll">
            Back
          </Link>
        )}
      </Form>
    </article>
  );
}
