import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Careers from "./pages/Careers";
import CertificateVerification from "./pages/CertificateVerification";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import AdminServices from "./pages/admin/AdminServices";
import AdminPortfolio from "./pages/admin/AdminPortfolio";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminCareers from "./pages/admin/AdminCareers";
import AdminCertificates from "./pages/admin/AdminCertificates";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminTeam from "./pages/admin/AdminTeam";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminBlog from "./pages/admin/AdminBlog";
import ServicesPage from "./pages/ServicesPage";
import PortfolioPage from "./pages/PortfolioPage";
import AboutPage from "./pages/AboutPage";
import LocationPage from "./pages/LocationPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/certificate-verification" element={<CertificateVerification />} />
          <Route path="/location" element={<LocationPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/portfolio" element={<AdminPortfolio />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/careers" element={<AdminCareers />} />
          <Route path="/admin/certificates" element={<AdminCertificates />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/team" element={<AdminTeam />} />
          <Route path="/admin/applications" element={<AdminApplications />} />
          <Route path="/admin/blog" element={<AdminBlog />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
