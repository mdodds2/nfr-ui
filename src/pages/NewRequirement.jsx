import { redirect } from 'react-router-dom';
import MainNavigation from "../components/MainNavigation";
import RequirementForm from "../components/RequirementForm";

import { addNewRequirement } from '../util/http';

export default function NewRequirement() {
    return (
        <main className="main-content">
            <MainNavigation />
            <section className="preview-area">
                <RequirementForm mode="new" />
            </section>
        </main>
    );
}

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

    if (response.status === 422) {
        return await response.json();
    }

    if (!response.ok) {
        throw new Error("Error when adding requirement");
    }

    return redirect('/requirements/displayAll');
}