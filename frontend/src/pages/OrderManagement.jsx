import { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";

function OrderManagement() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/all");

      setOrders(res.data.orders || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (
    orderId,
    status
  ) => {
    try {
      await API.put(
        `/orders/${orderId}/status`,
        { status }
      );

      toast.success(
        `Order status updated to ${status}`
      );

      fetchOrders();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update order status"
      );
    }
  };

  return (
    <div className="admin-page">
      <h1>Order Management</h1>

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
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id}>
                <td>
                  {order._id
                    .slice(-6)
                    .toUpperCase()}
                </td>

                <td>
                  {order.user?.name ||
                    "Unknown Customer"}
                </td>

                <td>
                  ₹
                  {Number(
                    order.totalAmount || 0
                  ).toLocaleString("en-IN")}
                </td>

                <td>{order.status}</td>

                <td>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(
                        order._id,
                        e.target.value
                      )
                    }
                  >
                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Processing">
                      Processing
                    </option>

                    <option value="Shipped">
                      Shipped
                    </option>

                    <option value="Delivered">
                      Delivered
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default OrderManagement;