import { useEffect, useState } from "react";
import {
  useSearchParams
} from "react-router-dom";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";

function DepartmentProducts({
  departmentName,
  title,
  description
}) {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const categoryFromUrl =
    searchParams.get("category") || "";

  const [department, setDepartment] =
    useState(null);
  const [categories, setCategories] =
    useState([]);
  const [products, setProducts] =
    useState([]);

  const [search, setSearch] =
    useState("");
  const [category, setCategory] =
    useState(categoryFromUrl);

  const [loading, setLoading] =
    useState(true);
  const [message, setMessage] =
    useState("");

  const fetchCategories = async (
    departmentId
  ) => {
    try {
      const res = await API.get(
        `/categories?department=${departmentId}`
      );

      setCategories(
        res.data.categories || []
      );
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

      params.append(
        "department",
        departmentId
      );

      if (selectedCategory) {
        params.append(
          "category",
          selectedCategory
        );
      }

      if (searchValue.trim()) {
        params.append(
          "search",
          searchValue.trim()
        );
      }

      const res = await API.get(
        `/products?${params.toString()}`
      );

      setProducts(
        res.data.products || []
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartment = async () => {
    try {
      const res = await API.get(
        "/departments"
      );

      const foundDepartment = (
        res.data.departments || []
      ).find(
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

      await fetchCategories(
        foundDepartment._id
      );

      await fetchProducts(
        foundDepartment._id,
        categoryFromUrl,
        ""
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to load department"
      );

      setLoading(false);
    }
  };

  useEffect(() => {
    setCategory(categoryFromUrl);
    fetchDepartment();
  }, [departmentName, categoryFromUrl]);

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
    const selectedCategory =
      e.target.value;

    setCategory(selectedCategory);

    if (selectedCategory) {
      setSearchParams({
        category: selectedCategory
      });
    } else {
      setSearchParams({});
    }
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSearchParams({});

    if (department) {
      fetchProducts(
        department._id,
        "",
        ""
      );
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

          <button type="submit">
            Search
          </button>

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