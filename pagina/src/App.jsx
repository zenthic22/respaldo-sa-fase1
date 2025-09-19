import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/Navegador";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { useAuth } from "./Auth";

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <NavigationBar/>
      <Routes>
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path='*' element={<Navigate to='/' replace={true}/>} exact={true}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;