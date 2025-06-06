import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequireAuth from "@/components/auth/RequireAuth";
import { AuthProvider } from "@/contexts/AuthContext";


// Page imports
import Index from "./pages/Index";
import FindPlayers from "./pages/FindPlayers";
import Matches from "./pages/Matches";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import FriendManagement from "./pages/FriendManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <RequireAuth>
                <Index />
              </RequireAuth>
            } />
            <Route path="/find" element={
              <RequireAuth>
                <FindPlayers />
              </RequireAuth>
            } />
            <Route path="/matches" element={
              <RequireAuth>
                <Matches />
              </RequireAuth>
            } />
            <Route path="/messages" element={
              <RequireAuth>
                <Messages />
              </RequireAuth>
            } />
            <Route path="/notifications" element={
              <RequireAuth>
                <Notifications />
              </RequireAuth>
            } />
            <Route path="/profile" element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            } />
            <Route path="/friends" element={
              <RequireAuth>
                <FriendManagement />
              </RequireAuth>
            } />
            <Route path="/users/:id" element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
