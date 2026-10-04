import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/sidebar";
import { UrlState } from "@/context";

const authOnlyPaths = ["/", "/auth"];

const AppLayout = () => {
  const { user } = UrlState();
  const { pathname } = useLocation();

  const isPublicPage = authOnlyPaths.includes(pathname) || pathname.startsWith("/:") ;
  const showSidebar = user && !isPublicPage;

  if (showSidebar) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: "32px 40px", minHeight: "100vh", overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Outlet />
    </div>
  );
};

export default AppLayout;
