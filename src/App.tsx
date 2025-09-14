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
import Home from "./pages/Home";
import RoutesPage from "./pages/RoutesPage";
import Tickets from "./pages/Tickets";
import Wallet from "./pages/Wallet";
import Profile from "./pages/Profile";
import Login from './pages/Login'
import Signup from './pages/Signup'
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
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <AuthScreen />
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