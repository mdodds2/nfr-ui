import { getAuthToken, setAuthToken, logout } from "./auth";

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

let refreshPromise = null;
async function refreshAccessToken() {
  // share one refresh across concurrent 401s
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('refresh failed');
        const { token } = await res.json();
        setAuthToken(token);
        return token;
      })
      .finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

export async function apiFetch(path, options = {}, retry = true) {
  const headers = { ...options.headers };
  const token = getAuthToken();
  if (token)
    headers.Authorization = `Bearer ${token}`;

  if (options.body && !headers['Content-Type'])
    headers['Content-Type'] = 'application/json';

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (response.status === 401 && retry && !path.startsWith('/auth/')) {
    try {
      await refreshAccessToken();
      return apiFetch(path, options, false); // retry once
    } catch {
      logout();
      window.location.assign('/login');
    }
  }
  return response;
}

async function getJson(path) {
  const response = await apiFetch(path);
  if (!response.ok) throw new Error(`GET ${path} failed: ${response.status}`);
  return response.json();
}

export const getCategories = () => getJson('/categories');
export const getCategory = (id) => getJson('/categories/' + id);
export const getSubCategories = (id) => getJson('/categories/' + id + '/subcategories?sort=sortOrder');
export const getRequirementsForSubCategory = (id) => getJson('/requirements/subCategory/' + id + '?sort=identifier');
export const getRequirement = (id) => getJson('/requirements/' + id);
export const getNextIdentifier = (catId, subId) => getJson('/requirements/nextIdentifier/' + catId + '/' + subId);
export const getReportsForUser = () => getJson('/reports?sort=createdAt');
export const getReport = (id) => getJson('/reports/' + id);
export const getUser = () => getJson('/users/me');


export async function addNewRequirement(requirement) {
    return apiFetch('/requirements', { method: 'POST', body: JSON.stringify(requirement) });
}

export async function updateRequirement(id, requirement) {
    return apiFetch('/requirements/' + id, { method: 'PATCH', body: JSON.stringify(requirement) });
}

export async function addNewReport(report) {
    return apiFetch('/reports', { method: 'POST', body: JSON.stringify(report) });
}

export async function updateReport(reportId, report) {
    return apiFetch('/reports/' + reportId, { method: 'PUT', body: JSON.stringify(report) });
}

export async function deleteReport(id) {
    return apiFetch('/reports/' + id, { method: 'DELETE'})
}

export async function forgotPassword(request) {
    return apiFetch('/auth/forgot-password', { method: 'POST', body: JSON.stringify(request) });
}

export async function resetPassword(request) {
    const response = await apiFetch('/auth/reset-password', { method: 'POST', body: JSON.stringify(request) });
    if(response.status !== 204) {
        throw new Error("Invalid response from reset password request");
    }
    return response;
}
