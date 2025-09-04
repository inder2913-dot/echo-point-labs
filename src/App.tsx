import { useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import Dashboard from "./pages/Dashboard";
import UserProfiles from "./pages/UserProfiles";
import Baselines from "./pages/Baselines";
import Industries from "./pages/Industries";
import Endpoints from "./pages/Endpoints";
import Organizations from "./pages/Organizations";
import Recommendations from "./pages/Recommendations";
import Project from "./pages/Project";
import ProjectDetails from "./pages/ProjectDetails";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for dev bypass first
    const devBypass = localStorage.getItem('dev-bypass-auth');
    const devUser = localStorage.getItem('dev-user');
    
    if (devBypass === 'true' && devUser) {
      const mockUser = JSON.parse(devUser);
      setUser(mockUser);
      
      // Create a mock session for the dev bypass with proper UUID
      const mockSession = {
        access_token: 'dev-access-token',
        refresh_token: 'dev-refresh-token',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'bearer',
        user: mockUser
      } as Session;
      
      setSession(mockSession);
      setLoading(false);
      return;
    }

    // Set up auth state listener for real Supabase auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <SidebarProvider>
                <div className="min-h-screen flex w-full bg-background">
                  <AppSidebar />
                  <div className="flex-1 flex flex-col">
                    <TopBar />
                    <main className="flex-1">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/profiles" element={<UserProfiles />} />
                        <Route path="/baselines" element={<Baselines />} />
                        <Route path="/industries" element={<Industries />} />
                        <Route path="/endpoints" element={<Endpoints />} />
                        <Route path="/projects" element={<Organizations />} />
                        <Route path="/recommendations" element={<Recommendations />} />
                        <Route path="/project" element={<Project />} />
                        <Route path="/project/:id" element={<ProjectDetails />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
