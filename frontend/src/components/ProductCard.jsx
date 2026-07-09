function ProductCard({ product }) {
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
        <p className="product-type">{product.type}</p>
        <h3>{product.name}</h3>
        <p>{product.brand}</p>
        <h4>₹{product.price}</h4>
        <button>View Details</button>
      </div>
    </div>
  );
}

export default ProductCard;