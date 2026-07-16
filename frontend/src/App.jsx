import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API, { injectLoader } from "./api/axios";
import Wishlist from "./pages/Wishlist";


import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import { useLoader } from "./context/LoaderContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ServiceDetails from "./pages/ServiceDetails";
import BookService from "./pages/BookService";
import MyServiceBookings from "./pages/MyServiceBookings";
import ServiceManagement from "./pages/ServiceManagement";
import ServiceBookingManagement from "./pages/ServiceBookingManagement";

import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cars from "./pages/Cars";
import Merchandise from "./pages/Merchandise";
import Modifications from "./pages/Modifications";

import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";

import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";

import UserManagement from "./pages/UserManagement";
import DepartmentManagement from "./pages/DepartmentManagement";
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
      const token = localStorage.getItem(
        "autocart_token"
      );

      if (!token) {
        setUser(null);
        return;
      }

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
      <Navbar
        user={user}
        setUser={setUser}
      />

      {loading && <Loader />}

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/products/:id"
          element={
            <ProductDetails user={user} />
          }
        />

        <Route
          path="/cars"
          element={<Cars />}
        />

        <Route
          path="/merchandise"
          element={<Merchandise />}
        />

        <Route
          path="/modifications"
          element={<Modifications />}
        />

        <Route
          path="/login"
          element={
            <Login setUser={setUser} />
          }
        />

        <Route
          path="/register"
          element={<Register />}
        />

       <Route
  path="/admin"
  element={
    <AdminDashboard
      user={user}
      setUser={setUser}
    />
  }
/>

<Route
  path="/manager"
  element={
    <ManagerDashboard
      user={user}
      setUser={setUser}
    />
  }
/>

<Route
  path="/customer"
  element={
    <CustomerDashboard
      user={user}
      setUser={setUser}
    />
  }
/>
        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/orders"
          element={<MyOrders />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/admin/users"
          element={<UserManagement />}
        />

        <Route
          path="/admin/departments"
          element={<DepartmentManagement />}
        />

        <Route
          path="/admin/categories"
          element={<CategoryManagement />}
        />

        <Route
          path="/admin/products"
          element={<ProductManagement />}
        />

        <Route
          path="/admin/orders"
          element={<OrderManagement />}
        />
        <Route
  path="/services/:id"
  element={<ServiceDetails user={user} />}
/>

<Route
  path="/services/:id/book"
  element={<BookService />}
/>
<Route
  path="/wishlist"
  element={<Wishlist />}
/>
<Route
  path="/service-bookings"
  element={<MyServiceBookings />}
/>

<Route
  path="/admin/services"
  element={<ServiceManagement />}
/>

<Route
  path="/admin/service-bookings"
  element={<ServiceBookingManagement />}
/>
      </Routes>

      <Footer />

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;