import { useEffect, useState } from "react";
import API from "../api/axios";
import BackButton from "../components/BackButton";


function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data.categories || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const submitCategory = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await API.put(`/categories/${editingId}`, { name });
      } else {
        await API.post("/categories", { name });
      }

      setName("");
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      setMessage(error.response?.data?.message || "Operation failed");
    }
  };

  const editCategory = (category) => {
    setEditingId(category._id);
    setName(category.name);
  };

  const deleteCategory = async (id) => {
    try {
      await API.delete(`/categories/${id}`);
      fetchCategories();
    } catch (error) {
      setMessage(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="admin-page">
      <BackButton />
      <h1>Category Management</h1>

      <form className="admin-form" onSubmit={submitCategory}>
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <button type="submit">
          {editingId ? "Update Category" : "Add Category"}
        </button>
      </form>

      {message && <p className="status-text error-text">{message}</p>}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Category</th>
            <th width="220">Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category) => (
            <tr key={category._id}>
              <td>{category.name}</td>

              <td>
                <button onClick={() => editCategory(category)}>
                  Edit
                </button>

                <button onClick={() => deleteCategory(category._id)}>
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

export default CategoryManagement;