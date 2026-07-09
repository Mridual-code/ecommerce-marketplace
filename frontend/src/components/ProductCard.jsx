import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div className="product-card">
      <div className="product-img">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <span>No Image</span>
        )}
      </div>

      <div className="product-info">
        <div className="product-top">
          <p className="product-type">{product.type}</p>
          <p className={product.stock > 0 ? "stock-badge" : "stock-badge out"}>
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>
        </div>

        <h3>{product.name}</h3>

        <p className="product-brand">
          {product.brand}
          {product.model && ` • ${product.model}`}
        </p>

        {product.category?.name && (
          <p className="product-category">{product.category.name}</p>
        )}

        <h4>₹{Number(product.price).toLocaleString("en-IN")}</h4>

        <div className="product-meta">
          {product.year && <span>{product.year}</span>}
          {product.fuelType && <span>{product.fuelType}</span>}
          {product.transmission && <span>{product.transmission}</span>}
          {product.scale && <span>{product.scale}</span>}
        </div>

        <button
          onClick={() => navigate(`/products/${product._id}`)}
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default ProductCard;