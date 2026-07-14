import { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    department: ""
  });

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data.categories || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load categories"
      );
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await API.get("/departments");
      setDepartments(res.data.departments || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load departments"
      );
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      department: ""
    });

    setEditingId(null);
  };

  const submitCategory = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.department) {
      toast.error(
        "Category name and department are required"
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        department: form.department
      };

      if (editingId) {
        await API.put(
          `/categories/${editingId}`,
          payload
        );

        toast.success(
          "Category updated successfully"
        );
      } else {
        await API.post("/categories", payload);

        toast.success(
          "Category added successfully"
        );
      }

      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Category operation failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const editCategory = (category) => {
    setEditingId(category._id);

    setForm({
      name: category.name || "",
      description: category.description || "",
      department:
        category.department?._id ||
        category.department ||
        ""
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const deleteCategory = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    try {
      await API.delete(`/categories/${id}`);

      toast.success(
        "Category deleted successfully"
      );

      if (editingId === id) {
        resetForm();
      }

      fetchCategories();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Category delete failed"
      );
    }
  };

  return (
    <div className="admin-page">
      <h1>Category Management</h1>

      <h2 className="form-title">
        {editingId
          ? "Update Category"
          : "Create New Category"}
      </h2>

      <form
        className="admin-form"
        onSubmit={submitCategory}
      >
        <input
          type="text"
          name="name"
          placeholder="Category Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="description"
          placeholder="Category Description"
          value={form.description}
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

          {departments.map((department) => (
            <option
              key={department._id}
              value={department._id}
            >
              {department.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? editingId
              ? "Updating..."
              : "Adding..."
            : editingId
              ? "Update Category"
              : "Add Category"}
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
            <th>Category</th>
            <th>Department</th>
            <th>Description</th>
            <th width="220">Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.length > 0 ? (
            categories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>

                <td>
                  {category.department?.name ||
                    "No department"}
                </td>

                <td>
                  {category.description ||
                    "No description"}
                </td>

                <td>
                  <button
                    type="button"
                    onClick={() =>
                      editCategory(category)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteCategory(category._id)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">
                No categories found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CategoryManagement;