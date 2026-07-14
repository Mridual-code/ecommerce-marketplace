import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";


function CustomerDashboard({user}) {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalSpent: 0,
    cartItems: 0
  });

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard/customer");

      console.log("Customer Dashboard:", res.data);

      setStats({
        totalOrders: res.data.stats.totalOrders,
        pendingOrders: res.data.stats.pendingOrders,
        deliveredOrders: res.data.stats.deliveredOrders,
        totalSpent: res.data.stats.totalSpent,
        cartItems: res.data.stats.cartItems
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="admin-page">
      <h1>Welcome, {user?.name} 👋</h1>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>{stats.totalOrders}</h2>
          <p>Total Orders</p>
        </div>

        <div className="dashboard-card">
          <h2>{stats.cartItems}</h2>
          <p>Cart Items</p>
        </div>

        <div className="dashboard-card">
          <h2>{stats.pendingOrders}</h2>
          <p>Pending Orders</p>
        </div>

        <div className="dashboard-card">
          <h2>{stats.deliveredOrders}</h2>
          <p>Delivered Orders</p>
        </div>

        <div className="dashboard-card">
          <h2>₹{Number(stats.totalSpent).toLocaleString("en-IN")}</h2>
          <p>Total Spent</p>
        </div>
      </div>

      <div className="admin-actions">
        <Link to="/products">Browse Products</Link>
        <Link to="/cart">My Cart</Link>
        <Link to="/orders">My Orders</Link>
        <Link to="/profile">My Profile</Link>
      </div>
    </div>
  );
}

export default CustomerDashboard;