import { redirect } from 'react-router-dom';
import ReportForm from "../components/ReportForm.jsx";

import { getCategories, addNewReport } from '../util/http';
import { getUserData } from '../util/auth.js';

export default function NewReport() {
    return (
        <main>
            <section>
                <ReportForm mode="new" />
            </section>
        </main>
    );
}

 //export async function action({ request }) {
export const action = (cartContext) => async ({ request, params }) => {
    const formData = await request.formData();

    const reportData = {
        userId: getUserData().id,
        name: formData.get('title'),
        description: formData.get('description'),
        requirementIds: [],
        measurements: [],
    }

    if (cartContext.items.length === 0) {
        return { error: 'Please select at least 1 Quality Attribute to create this report.' };
    }

    cartContext.items.forEach(item => {
        reportData.requirementIds = [...reportData.requirementIds, item.requirement.id];

        reportData.measurements = [...reportData.measurements,
            {
                "requirementId": item.requirement.id,
                "targetValue": item.targetValue,
                "thresholdValue": item.thresholdValue,
                "unit": item.unit,
                "measurementMethod": item.measurementMethod,
                "trigger": item.trigger,
                "context": item.context,
                "systemResponse": item.systemResponse,
                "owner": item.owner,
                "acceptanceCriteria": item.acceptanceCriteria,
                "notes": item.notes
            }
        ];
    });

    const response = await addNewReport(reportData);

    if (response.status === 422) {
        return await response.json();
    }

    if (!response.ok) {
        return { "error": "System error when adding report." };
    }

    return redirect('/reports');
}

export async function loader({ request, params }) {

    const categories = await getCategories();

    const data = {
        categories,
    }

    return data;
}