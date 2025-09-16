import { useState } from 'react'
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { CityProvider } from '@/contexts/CityContext'
import { BottomNavigation } from "@/components/BottomNavigation";
import RoleSelection from "@/components/RoleSelection";
import Home from "./pages/Home";
import RoutesPage from "./pages/RoutesPage";
import Tickets from "./pages/Tickets";
import Wallet from "./pages/Wallet";
import Profile from "./pages/Profile";
import DriverDashboard from "./pages/DriverDashboard";
import Login from './pages/Login'
import Signup from './pages/Signup'
import BookTicket from "./pages/BookTicket";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true)

  return isLogin ? (
    <Login onSwitchToSignup={() => setIsLogin(false)} />
  ) : (
    <Signup onSwitchToLogin={() => setIsLogin(true)} />
  )
}

function AppContent() {
  const { isAuthenticated, showRoleSelection, user } = useAuth()

  if (!isAuthenticated && !showRoleSelection) {
    return <AuthScreen />
  }

  if (showRoleSelection) {
    return <RoleSelection />
  }

  if (user?.role === 'driver') {
    return (
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<DriverDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<DriverDashboard />} />
        </Routes>
      </div>
    )
  }

  return (
    <CityProvider>
      <div className="min-h-screen bg-background pb-20">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/routes" element={<RoutesPage />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/book-ticket" element={<BookTicket />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
        <BottomNavigation />
      </div>
    </CityProvider>
  )
}

const App = () => (
  <ThemeProvider defaultTheme="light" storageKey="bus-app-theme">
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
  </ThemeProvider>
);

export default App;