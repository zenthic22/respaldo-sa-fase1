import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
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

  return (
    <BrowserRouter>
      <NavigationBar/>
      <Routes>
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />

        {user && (
          <>
              <Route path="/dashboard" element={<Dashboard/>}/>
              <Route path="/profile" element={<Profile/>}/>
              <Route path="/profiles" element={<ManageProfiles/>}/>
              <Route path="/subcriptions" element={<Subscriptions/>}/>
              <Route path="/explore" element={<Explore/>}/>
              <Route path="/favorites" element={<Favorites/>}/>
          </>
        )}

        {user?.role === "ADMIN" && (
          <>
            <Route path="/admin" element={<AdminPanel/>}/>
            <Route path="/admin/content" element={<ContentAdmin/>}/>
          </>
        )}

        <Route path="/profile-view" element={<ProfileView/>}/>

        <Route path="*" element={<Navigate to={user ? (user.activeProfile ? "/dashboard" : "/select-profile") : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;