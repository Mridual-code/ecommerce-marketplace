import { useEffect, useState } from "react";
import API from "../api/axios";
import BackButton from "../components/BackButton";

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    brand: "",
    model: "",
    type: "Real Car",
    category: "",
    price: "",
    stock: "",
    image: "",
    description: "",
    year: "",
    fuelType: "",
    transmission: "",
    scale: ""
  });

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data.products || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to fetch products");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data.categories || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setEditingId(null);

    setForm({
      name: "",
      brand: "",
      model: "",
      type: "Real Car",
      category: "",
      price: "",
      stock: "",
      image: "",
      description: "",
      year: "",
      fuelType: "",
      transmission: "",
      scale: ""
    });
  };

  const submitProduct = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await API.put(`/products/${editingId}`, form);
      } else {
        await API.post("/products", form);
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      setMessage(error.response?.data?.message || "Product action failed");
    }
  };

  const editProduct = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name || "",
      brand: product.brand || "",
      model: product.model || "",
      type: product.type || "Real Car",
      category: product.category?._id || product.category || "",
      price: product.price || "",
      stock: product.stock || "",
      image: product.image || "",
      description: product.description || "",
      year: product.year || "",
      fuelType: product.fuelType || "",
      transmission: product.transmission || "",
      scale: product.scale || ""
    });
  };

  const deleteProduct = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      setMessage(error.response?.data?.message || "Delete failed");
    }
  };
    return (
    <div className="admin-page">
        <BackButton />
      <h1>Product Management</h1>

      <form className="admin-form product-form" onSubmit={submitProduct}>
        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="brand"
          placeholder="Brand"
          value={form.brand}
          onChange={handleChange}
          required
        />

        <input
          name="model"
          placeholder="Model"
          value={form.model}
          onChange={handleChange}
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
        >
          <option value="Real Car">Real Car</option>
          <option value="Mini Toy">Mini Toy</option>
        </select>

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>

          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          required
        />

        <input
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
        />

        <input
          name="year"
          placeholder="Year"
          value={form.year}
          onChange={handleChange}
        />

        <input
          name="fuelType"
          placeholder="Fuel Type"
          value={form.fuelType}
          onChange={handleChange}
        />

        <input
          name="transmission"
          placeholder="Transmission"
          value={form.transmission}
          onChange={handleChange}
        />

        <input
          name="scale"
          placeholder="Scale"
          value={form.scale}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <button type="submit">
          {editingId ? "Update Product" : "Add Product"}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      {message && (
        <p className="status-text error-text">{message}</p>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Brand</th>
            <th>Type</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>{product.brand}</td>
              <td>{product.type}</td>
              <td>₹{product.price}</td>
              <td>{product.stock}</td>

              <td>
                <button onClick={() => editProduct(product)}>
                  Edit
                </button>

                <button onClick={() => deleteProduct(product._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductManagement;