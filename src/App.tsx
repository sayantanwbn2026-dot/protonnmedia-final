import { lazy, Suspense, useState, useCallback } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";

import { GlobalSettingsProvider } from "./contexts/GlobalSettingsContext";
import SmoothScroll from "./components/SmoothScroll";
import PageTransition from "./components/PageTransition";
import CustomCursor from "./components/CustomCursor";
import Preloader from "./components/Preloader";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import Work from "./pages/Work";
import Contact from "./pages/Contact";
import Process from "./pages/Process";
import Team from "./pages/Team";
import CaseStudyDetail from "./pages/CaseStudyDetail";
import NotFound from "./pages/NotFound";

const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const Admin = lazy(() => import("./pages/Admin"));

const queryClient = new QueryClient();

const AdminFallback = () => (
  <main className="min-h-screen flex items-center justify-center bg-background">
    <p className="font-body text-sm text-muted-foreground">Loading...</p>
  </main>
);

const AppRoutes = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isAdmin = pathname.startsWith('/admin');
  const [isPreloaderComplete, setIsPreloaderComplete] = useState(false);

  const handlePreloaderComplete = useCallback(() => {
    setIsPreloaderComplete(true);
    // Explicitly hop onto the landing page after preloader starts unless we are already there
    if (pathname !== '/') {
      navigate('/', { replace: true });
    }
  }, [navigate, pathname]);

  if (isAdmin) {
    return (
      <Suspense fallback={<AdminFallback />}>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <>
      {!isPreloaderComplete && <Preloader onComplete={handlePreloaderComplete} />}

      {isPreloaderComplete && (
        <>
          <CustomCursor />
          <Navbar />

          <PageTransition>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/work" element={<Work />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/process" element={<Process />} />
              <Route path="/team" element={<Team />} />
              <Route path="/case-study/:id" element={<CaseStudyDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTransition>
        </>
      )}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GlobalSettingsProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SmoothScroll>
            <AppRoutes />
          </SmoothScroll>
        </BrowserRouter>
      </GlobalSettingsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
