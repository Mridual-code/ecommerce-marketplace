import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

function ManagerDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    lowStockProducts: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard/manager");
      console.log("Manager Dashboard:", res.data);

      setStats({
        totalProducts: res.data.stats.totalProducts,
        totalCategories: res.data.stats.totalCategories,
        totalOrders: res.data.stats.totalOrders,
        lowStockProducts: res.data.stats.lowStockProducts
      });

      setRecentOrders(res.data.stats.recentOrders || []);
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
          <h2>{stats.totalProducts}</h2>
          <p>Total Products</p>
        </div>

        <div className="dashboard-card">
          <h2>{stats.totalCategories}</h2>
          <p>Total Categories</p>
        </div>

        <div className="dashboard-card">
          <h2>{stats.totalOrders}</h2>
          <p>Total Orders</p>
        </div>

        <div className="dashboard-card">
          <h2>{stats.lowStockProducts}</h2>
          <p>Low Stock Products</p>
        </div>
      </div>

      <div className="admin-actions">
        <Link to="/admin/departments">
    Manage Departments
  </Link>
        <Link to="/admin/products">Manage Products</Link>
        <Link to="/admin/categories">Manage Categories</Link>
        <Link to="/admin/orders">Manage Orders</Link>
      </div>

      <h2 style={{ marginTop: "50px", marginBottom: "20px" }}>
        Recent Orders
      </h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {recentOrders.map((order) => (
            <tr key={order._id}>
              <td>{order.user?.name}</td>
              <td>₹{order.totalAmount}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManagerDashboard;