import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { CityProvider } from '@/contexts/CityContext';
import { BottomNavigation } from "@/components/BottomNavigation";
import StudentOnboarding from "@/components/StudentOnboarding";
import { LanguageSelector } from "@/components/LanguageSelector";
import Home from "./pages/Home";
import RoutesPage from "./pages/RoutesPage";
import Profile from "./pages/Profile";
import DriverDashboard from "./pages/DriverDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Login from './pages/Login';
import BookTicket from "./pages/BookTicket";
import LiveTrackingPage from "./pages/LiveTrackingPage";
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();
function AppContent() {
  const { isAuthenticated, showStudentOnboarding, user } = useAuth();
  const { hasSelectedLanguage } = useLanguage();
  if (!hasSelectedLanguage) {
    return <LanguageSelector />;
  }
  if (!isAuthenticated && !showStudentOnboarding) {
    return <Login />;
  }
  // RoleSelection removed as per user request
  if (showStudentOnboarding) {
    return <StudentOnboarding />;
  }
  if (user?.role === 'driver') {
    return (<div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<DriverDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<DriverDashboard />} />
      </Routes>
    </div>);
  }
  if (user?.role === 'student') {
    return (<div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<StudentDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<StudentDashboard />} />
      </Routes>
    </div>);
  }
  return (<CityProvider>
    <div className="min-h-screen bg-background pb-20">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/routes" element={<RoutesPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/book-ticket" element={<BookTicket />} />
        <Route path="/tracking/:busId" element={<LiveTrackingPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BottomNavigation />
    </div>
  </CityProvider>);
}
const App = () => (<ThemeProvider defaultTheme="light" storageKey="bus-app-theme">
  <LanguageProvider>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  </LanguageProvider>
</ThemeProvider>);
export default App;
