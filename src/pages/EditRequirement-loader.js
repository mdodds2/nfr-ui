import { getRequirement} from "../util/http.js";

export async function loader({ params }) {
    return await getRequirement(params.id);
}