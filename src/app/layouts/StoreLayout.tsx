import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnnouncementBar } from "./AnnouncementBar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PageLoader } from "@/shared/components/PageLoader";

/** Scroll to top on route change (replaces data-router-only ScrollRestoration). */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export function StoreLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ScrollToTop />
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
