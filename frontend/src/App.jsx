import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import API from "./api/axios";
import { injectLoader } from "./api/axios";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import { useLoader } from "./context/LoaderContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import UserManagement from "./pages/UserManagement";
import CategoryManagement from "./pages/CategoryManagement";
import ProductManagement from "./pages/ProductManagement";
import OrderManagement from "./pages/OrderManagement";
function App() {
  const [user, setUser] = useState(null);

   const { loading, setLoading } = useLoader();
   useEffect(() => {
  injectLoader(setLoading);
}, [setLoading]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("autocart_token");

      if (!token) return;

      const res = await API.get("/auth/profile");
      setUser(res.data.user);
    } catch (error) {
      localStorage.removeItem("autocart_token");
      setUser(null);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>
      <Navbar user={user} setUser={setUser} />

       {loading && <Loader />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />

        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/categories" element={<CategoryManagement />} />   
        <Route path="/admin/products" element={<ProductManagement />} />
        <Route path="/admin/orders" element={<OrderManagement />} />
        <Route path="/products/:id" element={<ProductDetails user={user} />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;