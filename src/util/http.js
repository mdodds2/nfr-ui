import { getAuthToken } from "./auth";

export async function getCategories() {
    if(!getAuthToken()) return;

    const response = await fetch('http://localhost:8080/categories', {
        method: 'GET',
        headers: {
        'Content-Type': 'text/plain',
        'Authorization': ' Bearer ' + getAuthToken(),
        },
    });

    if (!response.ok) {

    } else {
        const responseData = await response.json();
        return responseData;
    }
}

export async function getCategory(categoryId) {
    if(!getAuthToken()) return;

    const response = await fetch('http://localhost:8080/categories/' + categoryId, {
        method: 'GET',
        headers: {
        'Content-Type': 'text/plain',
        'Authorization': ' Bearer ' + getAuthToken(),
        },
    });

    if (!response.ok) {

    } else {
        const responseData = await response.json();
        return responseData;
    }
}

export async function getSubCategories(categoryId) {
    const response = await fetch('http://localhost:8080/categories/' + categoryId + '/subcategories?sort=sortOrder' , {
        method: 'GET',
        headers: {
        'Content-Type': 'text/plain',
        'Authorization': ' Bearer ' + getAuthToken(),
        },
    });

    if (!response.ok) {

    } else {
        const responseData = await response.json();
        return responseData;
    }
}

export async function qotd() {

    const response = await fetch('https://officeapi.akashrajpurohit.com/quote/random' , {
        method: 'GET',
        headers: {
        'Content-Type': 'text/plain'
        },
    });

    if (!response.ok) {

    } else {
        const responseData = await response.json();
        return responseData;
    }
}

export async function addNewRequirement(requirement) {

    const response = await fetch('http://localhost:8080/requirements' , {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': ' Bearer ' + getAuthToken(),
        },
        body: JSON.stringify(requirement),
    });

    return response;
}

export async function getRequirementsForSubCategory(subCategoryId) {
    const response = await fetch('http://localhost:8080/requirements/subCategory/' + subCategoryId + '?sort=identifier', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': ' Bearer ' + getAuthToken(),
        }
    });

    if (!response.ok) {
        throw new Error("Error when fetching requirements for subCategory");
    } else {
        const responseData = await response.json();
        return responseData;
    }
}

export async function getRequirement(id) {
    const response = await fetch('http://localhost:8080/requirements/' + id, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': ' Bearer ' + getAuthToken(),
        }
    });

    if (!response.ok) {
        throw new Error("Error when fetching requirement");
    } else {
        const responseData = await response.json();
        return responseData;
    }
}

export async function updateRequirement(id, requirement) {

    const response = await fetch('http://localhost:8080/requirements/' + id, {
        method: 'PATCH',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': ' Bearer ' + getAuthToken(),
        },
        body: JSON.stringify(requirement),
    });

    if (!response.ok) {
        throw new Error("Error when adding requirement");
    } else {
        const responseData = await response.json();
        return responseData;
    }
}

export async function getNextIdentifier(categoryId, subCategoryId) {

    const response = await fetch('http://localhost:8080/requirements/nextIdentifier/' + categoryId + '/' + subCategoryId, {
        method: 'GET',
        headers: {
        'Content-Type': 'text/plain',
        'Authorization': ' Bearer ' + getAuthToken(),
        },
    });

    if (!response.ok) {
        throw new Error("Error when fetching next identifier");
    } else {
        const responseData = await response.json();
        return responseData;
    }
}

export async function getReportsForUser(userId) {

    if(!getAuthToken()) return;

    const response = await fetch('http://localhost:8080/users/' + userId + '/reports?sort=createdAt', {
        method: 'GET',
        headers: {
        'Content-Type': 'text/plain',
        'Authorization': ' Bearer ' + getAuthToken(),
        },
    });

    if (!response.ok) {
        throw new Error("Error when fetching reports");
    } else {
        const responseData = await response.json();
        return responseData;
    }
}

export async function getReport(reportId) {

    if(!getAuthToken()) return;

    const response = await fetch('http://localhost:8080/reports/' + reportId, {
        method: 'GET',
        headers: {
        'Content-Type': 'text/plain',
        'Authorization': ' Bearer ' + getAuthToken(),
        },
    });

    if (!response.ok) {
        throw new Error("Error when fetching report");
    } else {
        const responseData = await response.json();
        return responseData;
    }
}

export async function addNewReport(report) {

    const response = await fetch('http://localhost:8080/reports' , {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': ' Bearer ' + getAuthToken(),
        },
        body: JSON.stringify(report),
    });

    return response;
}

export async function updateReport(reportId, report) {

    const response = await fetch('http://localhost:8080/reports/' + reportId, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': ' Bearer ' + getAuthToken(),
        },
        body: JSON.stringify(report),
    });

    return response;
}

export async function deleteReport(id) {

    const response = await fetch('http://localhost:8080/reports/' + id , {
        method: 'DELETE',
        headers: {
        'Authorization': ' Bearer ' + getAuthToken(),
        },
    });

    return response;
}

export async function getUser(userId) {

    if(!getAuthToken()) return;

    const response = await fetch('http://localhost:8080/users/' + userId, {
        method: 'GET',
        headers: {
        'Content-Type': 'text/plain',
        'Authorization': ' Bearer ' + getAuthToken(),
        },
    });

    if (!response.ok) {
        throw new Error("Error when fetching user");
    } else {
        const responseData = await response.json();
        return responseData;
    }
}

