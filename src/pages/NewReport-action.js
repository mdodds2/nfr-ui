import { redirect } from 'react-router-dom';
import { addNewReport } from '../util/http';
import { getUserData } from '../util/auth.js';

export const action = (cartRef) => async ({request}) => {
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

    if (response.status === 400 || response.status === 409) {
        return await response.json();
    }

    if (!response.ok) {
        return { "error": "System error when adding report." };
    }

    cartRef.current.clearCart();
    return redirect('/reports');
}

