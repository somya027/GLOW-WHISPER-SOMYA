import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ActiveChatsPage from "./pages/ActiveChatsPage";
import ChatAnalyticsPage from "./pages/ChatAnalyticsPage";
import ProductDiscoveryPage from "./pages/ProductDiscoveryPage";
import SearchAnalyticsPage from "./pages/SearchAnalyticsPage";
import UsersPage from "./pages/UsersPage";
import SettingsPage from "./pages/SettingsPage";
import ConversationViewerPage from "./pages/ConversationViewerPage";
import AgentConfigPage from "./pages/AgentConfigPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<DashboardPage />} />
          <Route path="/active-chats" element={<ActiveChatsPage />} />
          <Route path="/chat-analytics" element={<ChatAnalyticsPage />} />
          <Route path="/product-discovery" element={<ProductDiscoveryPage />} />
          <Route path="/search-analytics" element={<SearchAnalyticsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/agent-config" element={<AgentConfigPage />} />
          <Route path="/conversation/:id" element={<ConversationViewerPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
