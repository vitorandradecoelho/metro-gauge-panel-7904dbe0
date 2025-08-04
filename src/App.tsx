import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import TripEdit from "./pages/TripEdit";
import NotFound from "./pages/NotFound";
import "@/lib/i18n";
import { initializeZone } from "@/hooks/useLocalStorage";
import { initGetLocalStorage } from "@/services/localStorage";

const queryClient = new QueryClient();

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log("🚀 Iniciando aplicação...");
        // Initialize zone first (for backward compatibility)
        initializeZone();
        console.log("✅ Zone inicializada");

        // Get token and zone from URL parameters
        function getParam(name) {
          const queryString =
            window.location.search || window.location.hash.split("?")[1] || "";
          const params = new URLSearchParams(queryString);
          return params.get(name);
        }

        const token = getParam("token");
        const zone = getParam("env");
        
        console.log("🔑 Token:", token ? "Presente" : "Ausente");
        console.log("🌍 Zone:", zone);

        // Initialize authentication if token is available
        if (token || localStorage.getItem("token")) {
          console.log("🔄 Inicializando autenticação...");
          await initGetLocalStorage(token, zone);
          console.log("✅ Autenticação inicializada");
        } else {
          console.log("⚠️ Sem token - usando modo mock");
        }

        console.log("✅ App inicializada com sucesso");
        setIsInitialized(true);
      } catch (error) {
        console.error("❌ Falha ao inicializar app:", error);
        setInitError(
          error instanceof Error ? error.message : "Initialization failed"
        );
        setIsInitialized(true); // Still allow app to load, may work with mock data
      }
    };

    initializeApp();
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Inicializando aplicação...</p>
          {initError && (
            <p className="text-destructive text-sm mt-2">
              Erro: {initError}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/trip-edit" element={<TripEdit />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
