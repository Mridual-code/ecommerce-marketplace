import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState("Loading product details...");

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`);
      setProduct(res.data.product || res.data);
      setMessage("");
    } catch (error) {
      console.log(error);
      setMessage("Failed to load product details");
    }
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("autocart_token");
      if (!token) return;

      const res = await API.get("/auth/profile");
      setCurrentUser(res.data.user);
    } catch (error) {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchUser();
  }, [id]);

  const addToCart = async () => {
    try {
      await API.post("/cart", {
        productId: id,
        quantity: 1
      });

      navigate("/cart");
    } catch (error) {
      console.log("Cart error:", error.response?.data);
      setMessage(error.response?.data?.message || "Failed to add to cart");
    }
  };

  if (message && !product) {
    return (
      <div className="product-details-page">
        <h2>{message}</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-page">
        <h2>No product found</h2>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <BackButton />

      <div className="product-details-box">
        <div className="details-image">
          {product.image ? (
            <img src={product.image} alt={product.name} />
          ) : (
            <span>No Image</span>
          )}
        </div>

        <div className="details-content">
          <p className="product-type">{product.type}</p>

          <h1>{product.name}</h1>

          <p className="product-brand">
            {product.brand}
            {product.model && ` • ${product.model}`}
          </p>

          {product.category?.name && (
            <p className="product-category">{product.category.name}</p>
          )}

          <h2>₹{Number(product.price).toLocaleString("en-IN")}</h2>

          <p className="details-description">
            {product.description || "No description available."}
          </p>

          <div className="details-grid">
            {product.year && (
              <div>
                <span>Year</span>
                <strong>{product.year}</strong>
              </div>
            )}

            {product.fuelType && (
              <div>
                <span>Fuel</span>
                <strong>{product.fuelType}</strong>
              </div>
            )}

            {product.transmission && (
              <div>
                <span>Transmission</span>
                <strong>{product.transmission}</strong>
              </div>
            )}

            {product.scale && (
              <div>
                <span>Scale</span>
                <strong>{product.scale}</strong>
              </div>
            )}

            <div>
              <span>Stock</span>
              <strong>
                {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
              </strong>
            </div>
          </div>

          {currentUser?.role?.toLowerCase() === "customer" ? (
            <button className="details-btn" onClick={addToCart}>
              Add to Cart
            </button>
          ) : (
            <p className="admin-note">
              Login as Customer to add this product to cart.
            </p>
          )}

          {message && <p className="status-text">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;