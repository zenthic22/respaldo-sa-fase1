// App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import NavigationBar from "./components/Navegador";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import Profile from "./pages/Perfil";
import ProfileView from "./pages/PerfilPreview";
import ManageProfiles from "./pages/ManageProfiles";
import Subscriptions from "./pages/Subscriptions";
import ContentAdmin from "./pages/ManageContent";
import Explore from "./pages/Explore";
import Favorites from "./pages/Favorites";
import { useAuth } from "./Auth";

function App() {
  const { user } = useAuth();
  const [stripePromise, setStripePromise] = useState(null);
  const [loadingStripe, setLoadingStripe] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { data } = await axios.get("http://localhost:3001/api/payments/config/stripe");
        if (isMounted && data?.publishableKey) {
          setStripePromise(loadStripe(data.publishableKey));
        }
      } catch (e) {
        console.error("No se pudo cargar la publishable key de Stripe:", e);
      } finally {
        if (isMounted) setLoadingStripe(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  // Espera a que Stripe esté listo antes de renderizar rutas que usan Elements
  if (loadingStripe) return null;

  return (
    <BrowserRouter>
      <NavigationBar />
      <Elements stripe={stripePromise}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {user && (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile/>}/>
              <Route path="/profiles" element={<ManageProfiles/>}/>
              <Route path="/subcriptions" element={<Subscriptions />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/favorites" element={<Favorites />} />
            </>
          )}

          {user?.role === "ADMIN" && (
            <>
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin/content" element={<ContentAdmin />} />
            </>
          )}

          <Route path="/profile-view" element={<ProfileView />} />

          <Route
            path="*"
            element={
              <Navigate
                to={
                  user
                    ? (user.activeProfile ? "/dashboard" : "/select-profile")
                    : "/login"
                }
                replace
              />
            }
          />
        </Routes>
      </Elements>
    </BrowserRouter>
  );
}

export default App;