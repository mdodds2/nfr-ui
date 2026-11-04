import { updateReport } from '../util/http.js';
import { getUserData } from '../util/auth.js';
import { redirect } from 'react-router-dom';

export const action = (cartRef) => async ({ request, params }) => {
    const formData = await request.formData();
    const items = cartRef.current.items;

    const reportData = {
        userId: getUserData().id,
        name: formData.get('title'),
        description: formData.get('description'),
        requirementIds: [],
        measurements: [],
    }

    if (items.length === 0) {
        return { error: 'Please select at least 1 Quality Attribute to create this report.' };
    }

    items.forEach(item => {
        reportData.requirementIds = [...reportData.requirementIds, item.requirement.id];

        reportData.measurements = [...reportData.measurements,
            {
                "id": item.id ?? "",
                "requirementId": item.requirement.id,
                "targetValue": item.targetValue ?? "",
                "thresholdValue": item.thresholdValue ?? "",
                "unit": item.unit ?? "",
                "measurementMethod": item.measurementMethod ?? "",
                "trigger": item.trigger ?? "",
                "context": item.context ?? "",
                "systemResponse": item.systemResponse ?? "",
                "owner": item.owner ?? "",
                "acceptanceCriteria": item.acceptanceCriteria ?? "",
                "notes": item.notes ?? ""
            }
        ];
    });

    const response = await updateReport(params.id, reportData);

    if (response.status === 400 || response.status === 409) {
        return await response.json();
    }

    if (!response.ok) {
        return {"error": "System error when updating report"};
    }

    cartRef.current.clearCart();
    return redirect('/reports');
}