import { useEffect, useState } from "react";
import {
  Link,
  useNavigate
} from "react-router-dom";
import API from "../api/axios";

function CustomerDashboard({
  user,
  setUser
}) {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalSpent: 0,
    cartItems: 0
  });

  const fetchDashboard = async () => {
    try {
      const res = await API.get(
        "/dashboard/customer"
      );

      setStats({
        totalOrders:
          res.data.stats?.totalOrders || 0,
        pendingOrders:
          res.data.stats?.pendingOrders || 0,
        deliveredOrders:
          res.data.stats?.deliveredOrders || 0,
        totalSpent:
          res.data.stats?.totalSpent || 0,
        cartItems:
          res.data.stats?.cartItems || 0
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const logout = () => {
    localStorage.removeItem("autocart_token");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="admin-page dashboard-page">
      <div className="dashboard-heading">
        <div>
          <p className="dashboard-label">
            My AutoCart
          </p>

          <h1>
            Welcome,{" "}
            {user?.name || "Customer"} 👋
          </h1>

          <p className="dashboard-subtitle">
            Track orders, manage your cart and
            explore new products.
          </p>
        </div>

        <button
          className="dashboard-logout"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      <div className="dashboard-grid customer-stats">
        <div className="dashboard-card">
          <span className="dashboard-card-icon">
            📦
          </span>
          <h2>{stats.totalOrders}</h2>
          <p>Total Orders</p>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-icon">
            🛒
          </span>
          <h2>{stats.cartItems}</h2>
          <p>Cart Items</p>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-icon">
            ⏳
          </span>
          <h2>{stats.pendingOrders}</h2>
          <p>Pending Orders</p>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-icon">
            ✅
          </span>
          <h2>{stats.deliveredOrders}</h2>
          <p>Delivered Orders</p>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-icon">
            💳
          </span>
          <h2>
            ₹
            {Number(
              stats.totalSpent
            ).toLocaleString("en-IN")}
          </h2>
          <p>Total Spent</p>
        </div>
      </div>

      <h2 className="dashboard-section-title">
        Quick Actions
      </h2>

      <div className="admin-actions">
        <Link to="/products">
          Browse Products
        </Link>

        <Link to="/cart">
          My Cart
        </Link>

        <Link to="/orders">
          My Orders
        </Link>
        <Link to="/service-bookings">
  My Service Bookings
</Link>

        <Link to="/profile">
          My Profile
        </Link>
      </div>
    </div>
  );
}

export default CustomerDashboard;