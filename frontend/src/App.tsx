import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import LandingPage from "./pages/LandingPage";
import Inventory from "./pages/Inventory";
import ShoppingList from "./pages/ShoppingList";
import ProtectedRoutes from "./components/ProtectedRoutes";

function App() {
  return (
    <>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<LandingPage />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/shopping-list" element={<ShoppingList />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
