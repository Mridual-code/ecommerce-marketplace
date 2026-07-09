import { useEffect, useState } from "react";
import API from "../api/axios";
import BackButton from "../components/BackButton";


function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/my-orders");
      setOrders(res.data.orders || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="orders-page">
        <BackButton />
      <h1>My Orders</h1>

      {message && <p className="status-text error-text">{message}</p>}

      {orders.length === 0 ? (
        <p className="status-text">No orders found.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-header">
                <div>
                  <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                  <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>

                <span className="order-status">{order.status}</span>
              </div>

              <div className="order-items">
                {order.items?.map((item) => (
                  <div className="order-item" key={item.product?._id || item._id}>
                    <span>{item.product?.name || "Product"}</span>
                    <span>Qty: {item.quantity}</span>
                    <span>₹{Number(item.price).toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>

              <div className="order-total">
                <strong>Total</strong>
                <strong>₹{Number(order.totalAmount).toLocaleString("en-IN")}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;