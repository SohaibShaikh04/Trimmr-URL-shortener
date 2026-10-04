/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "./db/apiAuth";
import { getAuthToken } from "./db/apiClient";

const UrlContext = createContext();

const UrlProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("trimmr_theme") || localStorage.getItem("lynx_theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }
    localStorage.setItem("trimmr_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const fetchUser = async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const isAuthenticated = Boolean(user && (user.role === "authenticated" || user.id));

  return (
    <UrlContext.Provider value={{ user, fetchUser, loading, isAuthenticated, theme, toggleTheme }}>
      {children}
    </UrlContext.Provider>
  );
};

export const UrlState = () => {
  return useContext(UrlContext);
};

export default UrlProvider;
