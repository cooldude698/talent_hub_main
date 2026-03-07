import AdminSubmissions from "./pages/AdminSubmissions";
import ClientDashboard from "./pages/ClientDashboard";
import ScrollToTop from "./ScrollToTop";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "next-themes";

import Layout from "@/components/layout/Layout";

import Index from "./pages/Index";
import Services from "./pages/Services";
import About from "./pages/About";
import WhyRawgenn from "./pages/WhyRawgenn";
import Reviews from "./pages/Reviews";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Portfolios from "./pages/Portfolios";
import Admin from "./pages/Admin";
import PostProject from "./pages/PostProject";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

import { HelmetProvider } from "react-helmet-async";
import SEO from "@/components/SEO";

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider attribute="class" forcedTheme="light" enableSystem={false}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>

            <Toaster />
            <Sonner />

            <BrowserRouter>

              <ScrollToTop />

              <Layout>

                <Routes>

                  <Route path="/admin/submissions" element={<AdminSubmissions />} />

                  <Route path="/dashboard" element={<ClientDashboard />} />

                  <Route
                    path="/"
                    element={
                      <SEO
                        title="RAWGENN | Premium Managed Freelance Agency"
                        description="RAWGENN connects businesses with elite freelancers."
                      >
                        <Index />
                      </SEO>
                    }
                  />

                  <Route
                    path="/services"
                    element={
                      <SEO
                        title="Services | RAWGENN"
                        description="Explore the freelance services offered by RAWGENN."
                      >
                        <Services />
                      </SEO>
                    }
                  />

                  <Route
                    path="/about"
                    element={
                      <SEO
                        title="About | RAWGENN"
                        description="Learn more about RAWGENN and our mission."
                      >
                        <About />
                      </SEO>
                    }
                  />

                  <Route path="/why-rawgenn" element={<WhyRawgenn />} />

                  <Route path="/reviews" element={<Reviews />} />

                  <Route
                    path="/contact"
                    element={
                      <SEO
                        title="Contact | RAWGENN"
                        description="Get in touch with RAWGENN to start your project."
                      >
                        <Contact />
                      </SEO>
                    }
                  />

                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  <Route path="/portfolios" element={<Portfolios />} />

                  <Route path="/admin" element={<Admin />} />

                  <Route path="/post-project" element={<PostProject />} />

                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<Terms />} />

                  <Route path="*" element={<NotFound />} />

                </Routes>

              </Layout>

            </BrowserRouter>

          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;