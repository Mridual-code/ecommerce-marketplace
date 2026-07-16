import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import WishlistButton from "../components/WishlistButton";

function ProductDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState(
    "Loading product details..."
  );

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`);

      setProduct(res.data.product || res.data);
      setMessage("");
    } catch (error) {
      console.log(error);

      setMessage(
        error.response?.data?.message ||
          "Failed to load product details"
      );
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    if (!user) {
      toast.info("Please log in as a customer first");
      navigate("/login");
      return;
    }

    if (user.role !== "Customer") {
      return;
    }

    if (product.stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    try {
      await API.post("/cart", {
        productId: id,
        quantity: 1
      });
      window.dispatchEvent(
  new Event("cart-updated")
);

      toast.success("Product added to cart");
      navigate("/cart");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to add product to cart"
      );
    }
  };

  const editProduct = () => {
    navigate("/admin/products", {
      state: {
        editProductId: product._id
      }
    });
  };

  if (!product) {
    return (
      <div className="product-details-page">
        <h2>{message}</h2>
      </div>
    );
  }

  const departmentName =
    product.category?.department?.name;

  return (
    <div className="product-details-page">
      <div className="product-details-box">
        <div className="details-image">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
            />
          ) : (
            <span>No Image</span>
          )}
        </div>

        <div className="details-content">
          {departmentName && (
            <p className="product-type">
              {departmentName}
            </p>
          )}

          <h1>{product.name}</h1>

          <p className="product-brand">
            {product.brand}
            {product.model &&
              ` • ${product.model}`}
          </p>

          {product.category?.name && (
            <p className="product-category">
              {product.category.name}
            </p>
          )}

          <h2>
            ₹
            {Number(
              product.price || 0
            ).toLocaleString("en-IN")}
          </h2>
          <div className="product-delivery-info">
  <strong>Delivery in 2–3 working days</strong>
  <span>
    Order tracking is available after checkout.
  </span>
</div>

{user?.role === "Customer" && (
  <WishlistButton productId={product._id} />
)}

          <p className="details-description">
            {product.description ||
              "No description available."}
          </p>

          <div className="details-grid">
            {product.color && (
              <div>
                <span>Color</span>
                <strong>{product.color}</strong>
              </div>
            )}

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
                <strong>
                  {product.transmission}
                </strong>
              </div>
            )}

            {product.scale && (
              <div>
                <span>Scale</span>
                <strong>{product.scale}</strong>
              </div>
            )}

            {product.material && (
              <div>
                <span>Material</span>
                <strong>{product.material}</strong>
              </div>
            )}

            {product.ageGroup && (
              <div>
                <span>Age Group</span>
                <strong>{product.ageGroup}</strong>
              </div>
            )}

            <div>
              <span>Stock</span>

              <strong>
                {product.stock > 0
                  ? `${product.stock} available`
                  : "Out of stock"}
              </strong>
            </div>
          </div>

          {user?.role === "Customer" && (
            <button
              className="details-btn"
              onClick={addToCart}
              disabled={product.stock <= 0}
            >
              {product.stock > 0
                ? "Add to Cart"
                : "Out of Stock"}
            </button>
          )}

          {user?.role === "Admin" && (
            <button
              className="details-btn"
              onClick={editProduct}
            >
              Edit Product Details
            </button>
          )}

          {!user && (
            <button
              className="details-btn"
              onClick={() => navigate("/login")}
            >
              Login to Add to Cart
            </button>
          )}

          {message && (
            <p className="status-text">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;