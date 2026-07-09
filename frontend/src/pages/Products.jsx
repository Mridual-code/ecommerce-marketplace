import { useEffect, useState } from "react";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const getProducts = async () => {
    try {
      setLoading(true);

      let url = "/products";

      const params = [];

      if (search) {
        params.push(`search=${search}`);
      }

      if (type) {
        params.push(`type=${type}`);
      }

      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }

      const res = await API.get(url);
      setProducts(res.data.products);
      setMessage("");
    } catch (error) {
      setMessage("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    getProducts();
  };

  const clearFilters = () => {
    setSearch("");
    setType("");

    setTimeout(() => {
      getProducts();
    }, 100);
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <BackButton />
        <p className="tagline">AutoCart Marketplace</p>
        <h1>Explore Cars & Mini Collectibles</h1>
        <p>
          Browse real cars, sports cars, JDM legends, Hot Wheels, die-cast
          models, and mini car toys.
        </p>
      </div>

      <form className="product-filters" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search BMW, Supra, Ferrari..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All Types</option>
          <option value="Real Car">Real Car</option>
          <option value="Mini Toy">Mini Toy</option>
        </select>

        <button type="submit">Search</button>
        <button type="button" className="clear-btn" onClick={clearFilters}>
          Clear
        </button>
      </form>

      {loading && <p className="status-text">Loading products...</p>}
      {message && <p className="status-text error-text">{message}</p>}

      {!loading && products.length === 0 && (
        <p className="status-text">No products found.</p>
      )}

      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Products;