import { redirect } from 'react-router-dom';
import { deleteRequirement } from "../util/http.js";

export async function action({ params }) {
    const response = await deleteRequirement(params.id);

    if (response.status === 400 || response.status === 409) {
        const body = await response.json();
        return { status: response.status, error: body.message };
    }

    if (!response.ok) {
      return {"error": "System error when deleting requirement"};
    }

    return redirect('/main/admin');
}
