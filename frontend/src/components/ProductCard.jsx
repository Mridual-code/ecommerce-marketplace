import { Link } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product }) {
  const departmentName =
    product.category?.department?.name || "";

  return (
    <article className="catalog-card">
      <div className="catalog-card__image">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
          />
        ) : (
          <span>No Image</span>
        )}
      </div>

      <div className="catalog-card__content">
        <div className="catalog-card__badges">
          {departmentName && (
            <span className="catalog-card__department">
              {departmentName}
            </span>
          )}

          <span
            className={
              product.stock > 0
                ? "catalog-card__stock available"
                : "catalog-card__stock unavailable"
            }
          >
            {product.stock > 0
              ? `${product.stock} in stock`
              : "Out of stock"}
          </span>
        </div>

        <h2>CSS TEST — {product.name}</h2>

        <p className="catalog-card__brand">
          {product.brand}
          {product.model &&
            ` • ${product.model}`}
        </p>

        {product.category?.name && (
          <p className="catalog-card__category">
            {product.category.name}
          </p>
        )}

        <h3 className="catalog-card__price">
          ₹
          {Number(
            product.price || 0
          ).toLocaleString("en-IN")}
        </h3>

        <Link
          to={`/products/${product._id}`}
          className="catalog-card__button"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

export default ProductCard;