import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

function AdminDashboard( {user}) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard/admin");

      console.log("Dashboard response:", res.data);

      setStats({
        totalUsers: res.data.stats?.totalUsers || 0,
        totalProducts: res.data.stats?.totalProducts || 0,
        totalOrders: res.data.stats?.totalOrders || 0,
        totalRevenue: res.data.stats?.totalRevenue || 0
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
          <h2>{stats.totalUsers}</h2>
          <p>Total Users</p>
        </div>

        <div className="dashboard-card">
          <h2>{stats.totalProducts}</h2>
          <p>Total Products</p>
        </div>

        <div className="dashboard-card">
          <h2>{stats.totalOrders}</h2>
          <p>Total Orders</p>
        </div>

        <div className="dashboard-card">
          <h2>₹{Number(stats.totalRevenue).toLocaleString("en-IN")}</h2>
          <p>Total Revenue</p>
        </div>
      </div>

      <div className="admin-actions">
        <Link to="/admin/users">Manage Users</Link>
        <Link to="/admin/departments">
  Manage Departments
</Link>
        <Link to="/admin/categories">Manage Categories</Link>
        <Link to="/admin/products">Manage Products</Link>
        <Link to="/admin/orders">Manage Orders</Link>
      </div>
    </div>
  );
}

export default AdminDashboard;