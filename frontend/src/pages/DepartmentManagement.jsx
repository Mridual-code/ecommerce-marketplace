import { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";

function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: ""
  });

  const fetchDepartments = async () => {
    try {
      const res = await API.get("/departments");
      setDepartments(res.data.departments || []);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to load departments"
      );
    }
  };

  useEffect(() => {
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
      description: ""
    });

    setEditingId(null);
    setMessage("");
  };

  const submitDepartment = async (e) => {
  e.preventDefault();

  try {
    if (editingId) {
      await API.put(`/departments/${editingId}`, form);
      toast.success("Department updated successfully");
    } else {
      await API.post("/departments", form);
      toast.success("Department added successfully");
    }

    resetForm();
    fetchDepartments();
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Department operation failed"
    );
  }
};

  const editDepartment = (department) => {
    setEditingId(department._id);

    setForm({
      name: department.name || "",
      description: department.description || ""
    });

    setMessage("");
  };

  const deleteDepartment = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this department?"
  );

  if (!confirmed) return;

  try {
    await API.delete(`/departments/${id}`);

    toast.success("Department deleted successfully");
    fetchDepartments();
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Failed to delete department"
    );
  }
};

  return (
    <div className="admin-page">
      <h1>Department Management</h1>

      <form
        className="admin-form"
        onSubmit={submitDepartment}
      >
        <input
          type="text"
          name="name"
          placeholder="Department Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="description"
          placeholder="Department Description"
          value={form.description}
          onChange={handleChange}
        />

        <button type="submit">
          {editingId
            ? "Update Department"
            : "Add Department"}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      {message && (
        <p className="status-text">{message}</p>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Department</th>
            <th>Description</th>
            <th width="220">Actions</th>
          </tr>
        </thead>

        <tbody>
          {departments.length > 0 ? (
            departments.map((department) => (
              <tr key={department._id}>
                <td>{department.name}</td>

                <td>
                  {department.description ||
                    "No description"}
                </td>

                <td>
                  <button
                    onClick={() =>
                      editDepartment(department)
                    }
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteDepartment(department._id)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">
                No departments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DepartmentManagement;