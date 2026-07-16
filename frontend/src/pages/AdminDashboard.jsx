import { useEffect, useState } from "react";
import {
  Link,
  useNavigate
} from "react-router-dom";
import API from "../api/axios";
import ServiceCalendar from "../components/ServiceCalendar";

function AdminDashboard({ user, setUser }) {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  const fetchDashboard = async () => {
    try {
      const res = await API.get(
        "/dashboard/admin"
      );

      setStats({
        totalUsers:
          res.data.stats?.totalUsers || 0,
        totalProducts:
          res.data.stats?.totalProducts || 0,
        totalOrders:
          res.data.stats?.totalOrders || 0,
        totalRevenue:
          res.data.stats?.totalRevenue || 0
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
          

          <h1>
            Welcome, {user?.name || "Admin"} 👋
          </h1>

          
        </div>

        <button
          className="dashboard-logout"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <span className="dashboard-card-icon">
            👥
          </span>
          <h2>{stats.totalUsers}</h2>
          <p>Total Users</p>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-icon">
            🚘
          </span>
          <h2>{stats.totalProducts}</h2>
          <p>Total Products</p>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-icon">
            📦
          </span>
          <h2>{stats.totalOrders}</h2>
          <p>Total Orders</p>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-icon">
            💰
          </span>
          <h2>
            ₹
            {Number(
              stats.totalRevenue
            ).toLocaleString("en-IN")}
          </h2>
          <p>Total Revenue</p>
        </div>
      </div>

      <h2 className="dashboard-section-title">
        Management
      </h2>

      <div className="admin-actions">
        <Link to="/admin/users">
          Manage Users
        </Link>

        <Link to="/admin/departments">
          Manage Departments
        </Link>

        <Link to="/admin/categories">
          Manage Categories
        </Link>

        <Link to="/admin/products">
          Manage Products
        </Link>

        <Link to="/admin/orders">
          Manage Orders
        </Link>
        <Link to="/admin/services">
  Manage Services
</Link>

<Link to="/admin/service-bookings">
  Manage Service Bookings
</Link>
      </div>
      <ServiceCalendar />
    </div>
  );
}

export default AdminDashboard;