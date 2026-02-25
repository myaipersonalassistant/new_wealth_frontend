import FirebaseAnalyticsTracker from "@/components/FirebaseAnalyticsTracker";
import RouteSEO from "@/components/RouteSEO";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import Calculator from "./pages/Calculator";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Start from "./pages/Start";
import Thanks from "./pages/Thanks";
import Course from "./pages/Course";
import Masterclass from "./pages/Masterclass";
import Dashboard from "./pages/Dashboard";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Refund from "./pages/Refund";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Foundation from "./pages/Foundation";
import Seminar from "./pages/Seminar";
import SeminarPurchase from "./pages/SeminarPurchase";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import BookPurchase from "./pages/BookPurchase";
import Auth from "./pages/Auth";
import Reviews from "./pages/Reviews";



const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RouteSEO />
          <FirebaseAnalyticsTracker />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/start" element={<Start />} />
            <Route path="/thanks" element={<Thanks />} />
            <Route path="/course" element={<Course />} />
            <Route path="/masterclass" element={<Masterclass />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/refund" element={<Refund />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/foundation" element={<Foundation />} />
            <Route path="/seminar" element={<Seminar />} />
            <Route path="/seminar-purchase" element={<SeminarPurchase />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancel />} />
            <Route path="/book-purchase" element={<BookPurchase />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="*" element={<NotFound />} />



          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
