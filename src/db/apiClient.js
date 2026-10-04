const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const getAuthToken = () => localStorage.getItem("token");
export const setAuthToken = (token) => localStorage.setItem("token", token);
export const removeAuthToken = () => localStorage.removeItem("token");

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let body = options.body;
  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    body,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage = data?.error || "An error occurred";
    throw new Error(errorMessage);
  }

  return data;
}

export const apiClient = {
  get: (endpoint, options) => request(endpoint, { ...options, method: "GET" }),
  post: (endpoint, body, options) => request(endpoint, { ...options, method: "POST", body }),
  put: (endpoint, body, options) => request(endpoint, { ...options, method: "PUT", body }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: "DELETE" }),
};
export default apiClient;
