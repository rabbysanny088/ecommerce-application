import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";
import Navbar from "./components/Navbar";
import Admin from "./pages/Admin";
import CartPage from "./pages/CartPage";
import Category from "./pages/Category";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PurchaseCancelPage from "./pages/PurchaseCancel";
import PurchaseSuccess from "./pages/PurchaseSuccess";
import Signup from "./pages/Signup";
import { useCartStore } from "./stores/useCartStore";
import { useUserStore } from "./stores/useUserStore";

const App = () => {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems } = useCartStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!user) return;
    getCartItems();
  }, [getCartItems, user]);

  if (checkingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="bg-gradient" />
        </div>
      </div>
      <div className="relative z-50 pt-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to={"/"} />}
          />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to={"/"} />}
          />
          <Route
            path="/secret-dashboard"
            element={user?.role === "admin" ? <Admin /> : <Navigate to={"/"} />}
          />
          <Route path="/category/:category" element={<Category />} />
          <Route
            path="/cart"
            element={user ? <CartPage /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/purchase-success"
            element={user ? <PurchaseSuccess /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/purchase-cancel"
            element={user ? <PurchaseCancelPage /> : <Navigate to={"/login"} />}
          />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
};

export default App;
