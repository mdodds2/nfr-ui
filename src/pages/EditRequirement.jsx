import { redirect } from 'react-router-dom';
import { useLoaderData } from "react-router-dom";
import RequirementForm from "../components/RequirementForm.jsx";
import MainNavigation from "../components/MainNavigation.jsx";

import { getRequirement, updateRequirement } from "../util/http.js";

export default function EditRequirement() {
    const data = useLoaderData();
    return (
        <main className="main-content">
            <MainNavigation />
            <section className="preview-area">
                <RequirementForm requirement={data} mode="edit" />
            </section>
        </main>
    );
}

export async function action({ request, params }) {
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

    const responseData = await updateRequirement(params.id, reqtData);
    

    return redirect('/main/admin');

}

export async function loader({ request, params }) {
    const reqt = await getRequirement(params.id);
    return reqt;
}