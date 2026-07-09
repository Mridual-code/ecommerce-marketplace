import { useEffect, useState } from "react";
import API from "../api/axios";
import BackButton from "../components/BackButton";

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/all");
      setOrders(res.data.orders || []);
      setMessage("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status });
      fetchOrders();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="admin-page">
        <BackButton />
        
    
      <h1>Order Management</h1>

      {message && (
        <p className="status-text error-text">{message}</p>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Update Status</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id.slice(-6).toUpperCase()}</td>

              <td>{order.user?.name}</td>

              <td>
                ₹{Number(order.totalAmount).toLocaleString("en-IN")}
              </td>

              <td>{order.status}</td>

              <td>
                <select
                  value={order.status}
                  onChange={(e) =>
                    updateStatus(order._id, e.target.value)
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderManagement;