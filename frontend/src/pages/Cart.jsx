import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

function Cart() {
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await API.get("/cart");
      setCart(res.data.cart?.items || res.data.items || []);
    } catch (error) {
      setMessage("Failed to load cart");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeFromCart = async (productId) => {
    try {
      await API.delete(`/cart/${productId}`);
      fetchCart();
    } catch (error) {
      setMessage("Failed to remove item");
    }
  };

  const totalAmount = cart.reduce((total, item) => {
  return total + item.product.price * item.quantity;
}, 0);

  return (
    <div className="cart-page">
    
       <BackButton />
      <h1>My Cart</h1>

      {message && <p className="status-text error-text">{message}</p>}

      {cart.length === 0 ? (
        <p className="status-text">Your cart is empty.</p>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-card" key={item.product._id}>
                <img src={item.product.image} alt={item.product.name} />

                <div>
                  <h3>{item.product.name}</h3>
                  <p>{item.product.brand}</p>
                  <h4>₹{Number(item.product.price).toLocaleString("en-IN")}</h4>
                  <p>Quantity: {item.quantity}</p>

                  <button onClick={() => removeFromCart(item.product._id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Total Items</span>
              <strong>{cart.length}</strong>
            </div>

            <div className="summary-row">
              <span>Total Amount</span>
              <strong>₹{Number(totalAmount).toLocaleString("en-IN")}</strong>
            </div>
            <button className="checkout-btn" onClick={() => navigate("/checkout")}>
  Proceed to Checkout
</button>

          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;