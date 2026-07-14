import { useEffect, useState } from "react";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchDepartments = async () => {
    try {
      const res = await API.get("/departments");
      setDepartments(res.data.departments || []);
    } catch (error) {
      console.log("Department error:", error);
    }
  };

  const fetchCategories = async (departmentId) => {
    if (!departmentId) {
      setCategories([]);
      return;
    }

    try {
      const res = await API.get(
        `/categories?department=${departmentId}`
      );

      setCategories(res.data.categories || []);
    } catch (error) {
      console.log("Category error:", error);
    }
  };

  const getProducts = async (customFilters = {}) => {
    try {
      setLoading(true);
      setMessage("");

      const selectedSearch =
        customFilters.search !== undefined
          ? customFilters.search
          : search;

      const selectedDepartment =
        customFilters.department !== undefined
          ? customFilters.department
          : department;

      const selectedCategory =
        customFilters.category !== undefined
          ? customFilters.category
          : category;

      const params = new URLSearchParams();

      if (selectedSearch.trim()) {
        params.append("search", selectedSearch.trim());
      }

      if (selectedDepartment) {
        params.append(
          "department",
          selectedDepartment
        );
      }

      if (selectedCategory) {
        params.append("category", selectedCategory);
      }

      const query = params.toString();

      const res = await API.get(
        query ? `/products?${query}` : "/products"
      );

      setProducts(res.data.products || []);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to fetch products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
    getProducts();
  }, []);

  const handleDepartmentChange = (e) => {
    const selectedDepartment = e.target.value;

    setDepartment(selectedDepartment);
    setCategory("");

    fetchCategories(selectedDepartment);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    getProducts();
  };

  const clearFilters = () => {
    setSearch("");
    setDepartment("");
    setCategory("");
    setCategories([]);

    getProducts({
      search: "",
      department: "",
      category: ""
    });
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <p className="tagline">
          AutoCart Marketplace
        </p>

        <h1>Explore AutoCart</h1>

        <p>
          Browse cars, merchandise, modification
          products and other automobile essentials.
        </p>
      </div>

      <form
        className="product-filters"
        onSubmit={handleSearch}
      >
        <input
          type="text"
          placeholder="Search by name, brand or model..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={department}
          onChange={handleDepartmentChange}
        >
          <option value="">
            All Departments
          </option>

          {departments.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          disabled={!department}
        >
          <option value="">
            {department
              ? "All Categories"
              : "Select Department First"}
          </option>

          {categories.map((item) => (
            <option key={item._id} value={item._id}>
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

      {!loading && products.length === 0 && (
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

export default Products;