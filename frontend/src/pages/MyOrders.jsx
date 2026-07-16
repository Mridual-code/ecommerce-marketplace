import { useEffect, useState } from "react";
import API from "../api/axios";
import OrderTimeline from "../components/OrderTimeline";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  const fetchOrders = async (
  showLoader = true
) => {
  try {
    const res = await API.get(
      "/orders/my-orders",
      {
        skipLoader: !showLoader
      }
    );

    setOrders(res.data.orders || []);
  } catch (error) {
    setMessage(
      error.response?.data?.message ||
        "Failed to load orders"
    );
  }
};

  useEffect(() => {
  // Show loader on initial page load
  fetchOrders(true);

  // Refresh silently every minute
  const interval = setInterval(() => {
    fetchOrders(false);
  }, 60 * 1000);

  return () => clearInterval(interval);
}, []);

  return (
    <div className="orders-page">
      <h1>My Orders</h1>

      {message && (
        <p className="status-text error-text">
          {message}
        </p>
      )}

      {orders.length === 0 ? (
        <p className="status-text">
          No orders found.
        </p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div
              className="order-card"
              key={order._id}
            >
              <div className="order-header">
                <div>
                  <h3>
                    Order #
                    {order._id
                      .slice(-6)
                      .toUpperCase()}
                  </h3>

                  <p>
                    Ordered on{" "}
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString("en-IN")}
                  </p>

                  {order.estimatedDeliveryDate && (
                    <p>
                      Estimated delivery:{" "}
                      <strong>
                        {new Date(
                          order.estimatedDeliveryDate
                        ).toLocaleDateString(
                          "en-IN"
                        )}
                      </strong>
                    </p>
                  )}
                </div>

                <span className="order-status">
                  {order.status}
                </span>
              </div>

              <OrderTimeline order={order} />

              <div className="order-items">
                {order.items?.map((item) => (
                  <div
                    className="order-item"
                    key={
                      item.product?._id ||
                      item._id
                    }
                  >
                    <span>
                      {item.product?.name ||
                        "Product"}
                    </span>

                    <span>
                      Qty: {item.quantity}
                    </span>

                    <span>
                      ₹
                      {Number(
                        item.price
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="order-total">
                <strong>Total</strong>
                <strong>
                  ₹
                  {Number(
                    order.totalAmount
                  ).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;