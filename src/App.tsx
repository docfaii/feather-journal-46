import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

const Landing = lazy(() => import("./pages/Landing"));
const Auth = lazy(() => import("./pages/Auth"));
const Index = lazy(() => import("./pages/Index"));
const EntryDetail = lazy(() => import("./pages/EntryDetail"));
const NewEntry = lazy(() => import("./pages/NewEntry"));
const Favorites = lazy(() => import("./pages/Favorites"));
const InnerCircle = lazy(() => import("./pages/Shared"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Bookmarks = lazy(() => import("./pages/Bookmarks"));
const BabyHealth = lazy(() => import("./pages/BabyHealth"));
const Wallet = lazy(() => import("./pages/Wallet"));
const Settings = lazy(() => import("./pages/Settings"));
const Insights = lazy(() => import("./pages/Insights"));
const Profile = lazy(() => import("./pages/Profile"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {/* Public routes */}
              <Route path="/landing" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/entry/:id" element={
                <ProtectedRoute>
                  <EntryDetail />
                </ProtectedRoute>
              } />
              <Route path="/new" element={
                <ProtectedRoute>
                  <NewEntry />
                </ProtectedRoute>
              } />
              <Route path="/favorites" element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              } />
              <Route path="/shared" element={
                <ProtectedRoute>
                  <InnerCircle />
                </ProtectedRoute>
              } />
              <Route path="/bookmarks" element={
                <ProtectedRoute>
                  <Bookmarks />
                </ProtectedRoute>
              } />
              <Route path="/baby-health" element={
                <ProtectedRoute>
                  <BabyHealth />
                </ProtectedRoute>
              } />
              <Route path="/wallet" element={
                <ProtectedRoute>
                  <Wallet />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/insights" element={
                <ProtectedRoute>
                  <Insights />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              {/* Fallback routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
