import { useEffect, useState } from "react";
import {
  Link,
  useNavigate
} from "react-router-dom";
import API from "../api/axios";

function ManagerDashboard({
  user,
  setUser
}) {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    lowStockProducts: 0
  });

  const [recentOrders, setRecentOrders] =
    useState([]);

  const fetchDashboard = async () => {
    try {
      const res = await API.get(
        "/dashboard/manager"
      );

      setStats({
        totalProducts:
          res.data.stats?.totalProducts || 0,
        totalCategories:
          res.data.stats?.totalCategories || 0,
        totalOrders:
          res.data.stats?.totalOrders || 0,
        lowStockProducts:
          res.data.stats?.lowStockProducts || 0
      });

      setRecentOrders(
        res.data.stats?.recentOrders || []
      );
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
            Manager Workspace
          </p>

          <h1>
            Welcome,{" "}
            {user?.name || "Manager"} 👋
          </h1>

          <p className="dashboard-subtitle">
            Manage inventory, categories and
            customer orders.
          </p>
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
            🚘
          </span>
          <h2>{stats.totalProducts}</h2>
          <p>Total Products</p>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-icon">
            🏷️
          </span>
          <h2>{stats.totalCategories}</h2>
          <p>Total Categories</p>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-icon">
            📦
          </span>
          <h2>{stats.totalOrders}</h2>
          <p>Total Orders</p>
        </div>

        <div className="dashboard-card warning-card">
          <span className="dashboard-card-icon">
            ⚠️
          </span>
          <h2>{stats.lowStockProducts}</h2>
          <p>Low Stock Products</p>
        </div>
      </div>

      <h2 className="dashboard-section-title">
        Management
      </h2>

      <div className="admin-actions">
        <Link to="/admin/departments">
          Manage Departments
        </Link>

        <Link to="/admin/products">
          Manage Products
        </Link>

        <Link to="/admin/categories">
          Manage Categories
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

      <h2 className="dashboard-section-title">
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
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <tr key={order._id}>
                <td>
                  {order.user?.name ||
                    "Unknown"}
                </td>

                <td>
                  ₹
                  {Number(
                    order.totalAmount || 0
                  ).toLocaleString("en-IN")}
                </td>

                <td>{order.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">
                No recent orders.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ManagerDashboard;