import apiClient from "./apiClient";

export async function getClicksForUrls(urlIds) {
  if (!urlIds || urlIds.length === 0) return [];
  try {
    const idsString = urlIds.join(",");
    const data = await apiClient.get(`/analytics?ids=${idsString}`);
    return data;
  } catch (error) {
    console.error("Error fetching clicks:", error);
    return null;
  }
}

export async function getClicksForUrl(url_id) {
  try {
    const data = await apiClient.get(`/analytics/${url_id}`);
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Unable to load Stats");
  }
}

export const storeClicks = async ({ id, originalUrl }) => {
  try {
    if (!id || !originalUrl) return;

    // Send a non-blocking post request to our public click tracking endpoint.
    // The backend will process the IP, User-Agent, and Referrer asynchronously.
    await apiClient.post(`/urls/${id}/click`, {});

    // Redirect to the original URL
    window.location.href = originalUrl;
  } catch (error) {
    console.error("Error recording click:", error);
    // Fallback: still redirect the user even if click tracking api fails
    window.location.href = originalUrl;
  }
};
export default { getClicksForUrls, getClicksForUrl, storeClicks };
