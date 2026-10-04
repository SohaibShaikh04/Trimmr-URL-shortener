import apiClient, { setAuthToken, removeAuthToken, getAuthToken } from "./apiClient";

export async function login({ email, password }) {
  try {
    const data = await apiClient.post("/auth/login", { email, password });
    if (data && data.token) {
      setAuthToken(data.token);
    }
    return data.user;
  } catch (error) {
    throw new Error(error.message || "Login failed");
  }
}

export async function signup(userData) {
  // Destructure supporting both naming variations from form state
  const { name, email, password, profile_pic, profilepic } = userData;
  const file = profile_pic || profilepic;

  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    if (file) {
      formData.append("profile_pic", file);
    }

    const data = await apiClient.post("/auth/register", formData);
    if (data && data.token) {
      setAuthToken(data.token);
    }
    return data.user;
  } catch (error) {
    throw new Error(error.message || "Registration failed");
  }
}

export async function getCurrentUser() {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const user = await apiClient.get("/auth/me");
    return user;
  } catch (error) {
    // If the token is invalid or expired, clear it
    removeAuthToken();
    return null;
  }
}

export async function logout() {
  removeAuthToken();
}
export default { login, signup, getCurrentUser, logout };
