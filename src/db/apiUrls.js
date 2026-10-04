import apiClient from "./apiClient";

export async function getUrls() {
  try {
    const response = await apiClient.get("/urls");
    // Backend returns { data: [], total, page, limit } — unwrap the array
    return Array.isArray(response) ? response : (response?.data ?? []);
  } catch (error) {
    console.error(error);
    throw new Error("Unable to load URLs");
  }
}

export async function getUrl({ id }) {
  try {
    const data = await apiClient.get(`/urls/${id}`);
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Short URL not found");
  }
}

export async function getLongUrl(id) {
  try {
    // Call the public resolve endpoint
    const data = await apiClient.get(`/urls/resolve/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching short link:", error);
    return null;
  }
}

export async function createUrl({ title, longUrl, customUrl }) {
  try {
    // Send a standard JSON request. The backend will generate the QR code automatically.
    const data = await apiClient.post("/urls", {
      title,
      longUrl,
      customUrl: customUrl || null,
    });
    return data; // Returns [newUrl] which matches frontend data[0].id expectation
  } catch (error) {
    console.error(error);
    throw new Error(error.message || "Error creating short URL");
  }
}

export async function deleteUrl(id) {
  try {
    const data = await apiClient.delete(`/urls/${id}`);
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Unable to delete URL");
  }
}
export default { getUrls, getUrl, getLongUrl, createUrl, deleteUrl };
