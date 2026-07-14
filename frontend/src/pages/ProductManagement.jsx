import { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";

const initialForm = {
  name: "",
  brand: "",
  model: "",
  department: "",
  category: "",
  price: "",
  stock: "",
  image: "",
  description: "",
  color: "",
  year: "",
  fuelType: "",
  transmission: "",
  scale: "",
  material: "",
  ageGroup: ""
};

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [departments, setDepartments] =
    useState([]);
  const [categories, setCategories] =
    useState([]);

  const [editingId, setEditingId] =
    useState(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [form, setForm] =
    useState(initialForm);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");

      setProducts(res.data.products || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch products"
      );
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await API.get(
        "/departments"
      );

      setDepartments(
        res.data.departments || []
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch departments"
      );
    }
  };

  const fetchCategoriesByDepartment = async (
    departmentId
  ) => {
    if (!departmentId) {
      setCategories([]);
      return;
    }

    try {
      const res = await API.get(
        `/categories?department=${departmentId}`
      );

      setCategories(
        res.data.categories || []
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch categories"
      );
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "department") {
      setForm((currentForm) => ({
        ...currentForm,
        department: value,
        category: ""
      }));

      fetchCategoriesByDepartment(value);
      return;
    }

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setCategories([]);
    setEditingId(null);
  };

  const createProductPayload = () => {
    const payload = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      model: form.model.trim(),
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      image: form.image.trim(),
      description: form.description.trim(),
      color: form.color.trim(),
      fuelType: form.fuelType.trim(),
      transmission:
        form.transmission.trim(),
      scale: form.scale.trim(),
      material: form.material.trim(),
      ageGroup: form.ageGroup.trim()
    };

    if (form.year) {
      payload.year = Number(form.year);
    }

    return payload;
  };

  const submitProduct = async (e) => {
    e.preventDefault();

    if (
      !form.department ||
      !form.category
    ) {
      toast.error(
        "Please select a department and category"
      );

      return;
    }

    try {
      setIsSubmitting(true);

      const payload =
        createProductPayload();

      if (editingId) {
        await API.put(
          `/products/${editingId}`,
          payload
        );

        toast.success(
          "Product updated successfully"
        );
      } else {
        await API.post(
          "/products",
          payload
        );

        toast.success(
          "Product added successfully"
        );
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Product operation failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const editProduct = async (product) => {
    const departmentId =
      product.category?.department?._id ||
      product.category?.department ||
      "";

    await fetchCategoriesByDepartment(
      departmentId
    );

    setEditingId(product._id);

    setForm({
      name: product.name || "",
      brand: product.brand || "",
      model: product.model || "",
      department: departmentId,
      category:
        product.category?._id ||
        product.category ||
        "",
      price: product.price ?? "",
      stock: product.stock ?? "",
      image: product.image || "",
      description:
        product.description || "",
      color: product.color || "",
      year: product.year || "",
      fuelType: product.fuelType || "",
      transmission:
        product.transmission || "",
      scale: product.scale || "",
      material: product.material || "",
      ageGroup: product.ageGroup || ""
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const deleteProduct = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await API.delete(`/products/${id}`);

      toast.success(
        "Product deleted successfully"
      );

      if (editingId === id) {
        resetForm();
      }

      fetchProducts();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete product"
      );
    }
  };

  return (
    <div className="admin-page">
      <h1>Product Management</h1>

      <h2 className="form-title">
        {editingId
          ? "Update Product"
          : "Create New Product"}
      </h2>

      <form
        className="admin-form product-form"
        onSubmit={submitProduct}
      >
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
          name="department"
          value={form.department}
          onChange={handleChange}
          required
        >
          <option value="">
            Select Department
          </option>

          {departments.map(
            (department) => (
              <option
                key={department._id}
                value={department._id}
              >
                {department.name}
              </option>
            )
          )}
        </select>

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          disabled={!form.department}
        >
          <option value="">
            {form.department
              ? "Select Category"
              : "Select Department First"}
          </option>

          {categories.map(
            (category) => (
              <option
                key={category._id}
                value={category._id}
              >
                {category.name}
              </option>
            )
          )}
        </select>

        <input
          type="number"
          name="price"
          placeholder="Price"
          min="0"
          value={form.price}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          min="0"
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
          name="color"
          placeholder="Color"
          value={form.color}
          onChange={handleChange}
        />

        <input
          type="number"
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

        <input
          name="material"
          placeholder="Material"
          value={form.material}
          onChange={handleChange}
        />

        <input
          name="ageGroup"
          placeholder="Age Group"
          value={form.ageGroup}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? editingId
              ? "Updating..."
              : "Adding..."
            : editingId
              ? "Update Product"
              : "Add Product"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Brand</th>
            <th>Department</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>

                <td>{product.brand}</td>

                <td>
                  {product.category
                    ?.department?.name ||
                    "Not assigned"}
                </td>

                <td>
                  {product.category?.name ||
                    "Not assigned"}
                </td>

                <td>
                  ₹
                  {Number(
                    product.price || 0
                  ).toLocaleString("en-IN")}
                </td>

                <td>{product.stock}</td>

                <td>
                  <button
                    type="button"
                    onClick={() =>
                      editProduct(product)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteProduct(
                        product._id
                      )
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductManagement;