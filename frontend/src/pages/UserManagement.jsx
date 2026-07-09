import { useEffect, useState } from "react";
import API from "../api/axios";
import BackButton from "../components/BackButton";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await API.get(`/users?search=${search}`);
      setUsers(res.data.users || []);
      setMessage("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id, role) => {
    try {
      await API.put(`/users/${id}/role`, { role });
      fetchUsers();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update role");
    }
  };

  const deleteUser = async (id) => {
    try {
      await API.delete(`/users/${id}`);
      fetchUsers();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="admin-page">
        <BackButton />
      <h1>User Management</h1>

      <div className="admin-search">
        <input
          type="text"
          placeholder="Search user by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={fetchUsers}>Search</button>
      </div>

      {message && <p className="status-text error-text">{message}</p>}

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
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>

              <td>
                <select
                  value={user.role}
                  onChange={(e) => updateRole(user._id, e.target.value)}
                >
                  <option value="Customer">Customer</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </td>

              <td>
                <button onClick={() => deleteUser(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;