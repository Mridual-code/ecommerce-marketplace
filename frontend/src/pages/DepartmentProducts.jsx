import { useEffect, useState } from "react";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";

function DepartmentProducts({
  departmentName,
  title,
  description
}) {
  const [department, setDepartment] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchDepartment = async () => {
    try {
      const res = await API.get("/departments");

      const foundDepartment =
        (res.data.departments || []).find(
          (item) =>
            item.name.toLowerCase() ===
            departmentName.toLowerCase()
        );

      if (!foundDepartment) {
        setMessage(
          `${departmentName} department has not been created yet.`
        );
        setLoading(false);
        return;
      }

      setDepartment(foundDepartment);

      await fetchCategories(foundDepartment._id);
      await fetchProducts(foundDepartment._id);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to load department"
      );

      setLoading(false);
    }
  };

  const fetchCategories = async (departmentId) => {
    try {
      const res = await API.get(
        `/categories?department=${departmentId}`
      );

      setCategories(res.data.categories || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProducts = async (
    departmentId,
    selectedCategory = "",
    searchValue = ""
  ) => {
    try {
      setLoading(true);
      setMessage("");

      const params = new URLSearchParams();

      params.append("department", departmentId);

      if (selectedCategory) {
        params.append("category", selectedCategory);
      }

      if (searchValue.trim()) {
        params.append("search", searchValue.trim());
      }

      const res = await API.get(
        `/products?${params.toString()}`
      );

      setProducts(res.data.products || []);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartment();
  }, [departmentName]);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!department) return;

    fetchProducts(
      department._id,
      category,
      search
    );
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;

    setCategory(selectedCategory);

    if (department) {
      fetchProducts(
        department._id,
        selectedCategory,
        search
      );
    }
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");

    if (department) {
      fetchProducts(department._id, "", "");
    }
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <p className="tagline">
          AutoCart {departmentName}
        </p>

        <h1>{title}</h1>

        <p>{description}</p>
      </div>

      {department && (
        <form
          className="product-filters"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            placeholder={`Search ${departmentName.toLowerCase()}...`}
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={category}
            onChange={handleCategoryChange}
          >
            <option value="">
              All Categories
            </option>

            {categories.map((item) => (
              <option
                key={item._id}
                value={item._id}
              >
                {item.name}
              </option>
            ))}
          </select>

          <button type="submit">Search</button>

          <button
            type="button"
            className="clear-btn"
            onClick={clearFilters}
          >
            Clear
          </button>
        </form>
      )}

      {loading && (
        <p className="status-text">
          Loading products...
        </p>
      )}

      {message && (
        <p className="status-text error-text">
          {message}
        </p>
      )}

      {!loading &&
        !message &&
        products.length === 0 && (
          <p className="status-text">
            No products found.
          </p>
        )}

      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
}

export default DepartmentProducts;