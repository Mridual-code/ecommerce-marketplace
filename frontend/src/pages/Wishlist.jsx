import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";

function Wishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await API.get("/wishlist");

      setProducts(
        res.data.wishlist?.products || []
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load wishlist"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();

    window.addEventListener(
      "wishlist-updated",
      fetchWishlist
    );

    return () => {
      window.removeEventListener(
        "wishlist-updated",
        fetchWishlist
      );
    };
  }, []);

  return (
    <main className="products-page wishlist-page">
      <div className="section-heading">
        <p>Saved Products</p>
        <h1>My Wishlist</h1>
      </div>

      {loading ? (
        <p className="status-text">
          Loading wishlist...
        </p>
      ) : products.length === 0 ? (
        <p className="status-text">
          Your wishlist is empty.
        </p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default Wishlist;