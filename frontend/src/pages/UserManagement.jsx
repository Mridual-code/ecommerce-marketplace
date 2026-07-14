import { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await API.get(
        `/users?search=${encodeURIComponent(search)}`
      );

      setUsers(res.data.users || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load users"
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id, role) => {
    try {
      await API.put(`/users/${id}/role`, {
        role
      });

      toast.success(
        "User role updated successfully"
      );

      fetchUsers();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update user role"
      );
    }
  };

  const deleteUser = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    try {
      await API.delete(`/users/${id}`);

      toast.success(
        "User deleted successfully"
      );

      fetchUsers();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete user"
      );
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  return (
    <div className="admin-page">
      <h1>User Management</h1>

      <form
        className="admin-search"
        onSubmit={handleSearch}
      >
        <input
          type="text"
          placeholder="Search user by name or email"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <button type="submit">
          Search
        </button>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Current Role</th>
            <th>Change Role</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>

                <td>
                  <select
                    value={user.role}
                    onChange={(e) =>
                      updateRole(
                        user._id,
                        e.target.value
                      )
                    }
                  >
                    <option value="Customer">
                      Customer
                    </option>

                    <option value="Manager">
                      Manager
                    </option>

                    <option value="Admin">
                      Admin
                    </option>
                  </select>
                </td>

                <td>
                  <button
                    type="button"
                    onClick={() =>
                      deleteUser(user._id)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;