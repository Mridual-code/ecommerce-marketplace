import { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";

const orderStatuses = [
  "Pending",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled"
];

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] =
    useState(true);

  const fetchOrders = async (
  showLoader = true
) => {
  try {
    const res = await API.get(
      "/orders/all",
      {
        skipLoader: !showLoader
      }
    );

    setOrders(res.data.orders || []);
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Failed to load orders"
    );
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
  fetchOrders(true);

  const interval = setInterval(() => {
    fetchOrders(false);
  }, 60 * 1000);

  return () => clearInterval(interval);
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

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };

  return (
    <div className="admin-page">
      <h1>Order Management</h1>

      {loading ? (
        <p className="status-text">
          Loading orders...
        </p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Order Date</th>
              <th>Estimated Delivery</th>
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
                    <strong>
                      {order.user?.name ||
                        "Unknown Customer"}
                    </strong>

                    {order.user?.email && (
                      <span>
                        {order.user.email}
                      </span>
                    )}
                  </td>

                  <td>
                    {formatDate(order.createdAt)}
                  </td>

                  <td>
                    {formatDate(
                      order.estimatedDeliveryDate
                    )}
                  </td>

                  <td>
                    ₹
                    {Number(
                      order.totalAmount || 0
                    ).toLocaleString("en-IN")}
                  </td>

                  <td>
                    <span
                      className={`order-status order-status-${order.status
                        .toLowerCase()
                        .replaceAll(" ", "-")}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td>
                    <select
                      value={order.status}
                      disabled={
                        order.status === "Delivered" ||
                        order.status === "Cancelled"
                      }
                      onChange={(e) =>
                        updateStatus(
                          order._id,
                          e.target.value
                        )
                      }
                    >
                      {orderStatuses.map(
                        (status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        )
                      )}
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OrderManagement;