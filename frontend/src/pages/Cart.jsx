import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Cart() {
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await API.get("/cart");

      setCart(
        res.data.cart?.items ||
          res.data.items ||
          []
      );

      setMessage("");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to load cart";

      setMessage(errorMessage);
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeFromCart = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this product from your cart?"
    );

    if (!confirmed) return;

    try {
      await API.delete(`/cart/${productId}`);

      toast.success(
        "Product removed from cart successfully"
      );

      fetchCart();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to remove product from cart"
      );
    }
  };

  const totalAmount = cart.reduce(
    (total, item) => {
      const price = Number(
        item.product?.price || 0
      );

      const quantity = Number(
        item.quantity || 0
      );

      return total + price * quantity;
    },
    0
  );

  const totalItems = cart.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  return (
    <div className="cart-page">
      <h1>My Cart</h1>

      {message && (
        <p className="status-text error-text">
          {message}
        </p>
      )}

      {cart.length === 0 ? (
        <p className="status-text">
          Your cart is empty.
        </p>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => {
              const product = item.product;

              if (!product) {
                return null;
              }

              return (
                <div
                  className="cart-card"
                  key={product._id}
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                    />
                  ) : (
                    <div className="no-image">
                      No Image
                    </div>
                  )}

                  <div>
                    <h3>{product.name}</h3>

                    <p>
                      {product.brand}
                      {product.model &&
                        ` • ${product.model}`}
                    </p>

                    {product.category?.name && (
                      <p>
                        Category:{" "}
                        {product.category.name}
                      </p>
                    )}

                    <h4>
                      ₹
                      {Number(
                        product.price || 0
                      ).toLocaleString("en-IN")}
                    </h4>

                    <p>
                      Quantity: {item.quantity}
                    </p>

                    <button
                      onClick={() =>
                        removeFromCart(product._id)
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Total Items</span>
              <strong>{totalItems}</strong>
            </div>

            <div className="summary-row">
              <span>Total Amount</span>

              <strong>
                ₹
                {Number(
                  totalAmount
                ).toLocaleString("en-IN")}
              </strong>
            </div>

            <button
              className="checkout-btn"
              onClick={() =>
                navigate("/checkout")
              }
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;