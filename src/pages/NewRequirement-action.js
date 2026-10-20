import { redirect } from 'react-router-dom';
import { addNewRequirement } from '../util/http';

export async function action({ request }) {
    const formData = await request.formData();

    const reqtData = {
        subCategoryId: formData.get('subCategory'),
        identifier: formData.get('identifier'),
        title: formData.get('title'),
        description: formData.get('description'),
        priority: formData.get('priority'),
        status: formData.get('status'),
        targetValue: formData.get('targetValue'),
        thresholdValue: formData.get('thresholdValue'),
        unit: formData.get('unit'),
        measurementMethod: formData.get('measurementMethod'),
        rationale: formData.get('rationale'),
        source: formData.get('source'),
        riskIfViolated: formData.get('riskIfViolated'),
    }

    const response = await addNewRequirement(reqtData);

    if (response.status === 400 || response.status === 409) {
        return await response.json();
    }

    if (!response.ok) {
        throw new Error("Error when adding requirement");
    }

    return redirect('/requirements/displayAll');
}