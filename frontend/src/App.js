import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Use environment variable or fallback to localhost for development
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // -------------------- FETCH USERS --------------------
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_URL}/api/users`);
      const data = await res.json();
      console.log("API Response:", data); // 👀 Debug line

      if (data.success) {
        // handle multiple response formats
        if (Array.isArray(data.data)) {
          setUsers(data.data);
        } else if (Array.isArray(data.data?.users)) {
          setUsers(data.data.users);
        } else if (Array.isArray(data.users)) {
          setUsers(data.users);
        } else if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setUsers([]); // fallback
        }
      } else {
        setError(data.message || "Failed to fetch users");
      }
    } catch (err) {
      setError("Failed to connect to server");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // -------------------- SUBMIT FORM --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const url = editingId
        ? `${API_URL}/api/users/${editingId}`
        : `${API_URL}/api/users`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(editingId ? "User updated successfully!" : "User added successfully!");
        setForm({ name: "", email: "" });
        setEditingId(null);
        fetchUsers();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Operation failed");
      }
    } catch (err) {
      setError("Failed to save user");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // -------------------- EDIT USER --------------------
  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email });
    setEditingId(user._id);
    setError("");
    setSuccess("");
  };

  // -------------------- DELETE USER --------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setSuccess("User deleted successfully!");
        fetchUsers();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Failed to delete user");
      }
    } catch (err) {
      setError("Failed to delete user");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // -------------------- CANCEL EDIT --------------------
  const handleCancel = () => {
    setForm({ name: "", email: "" });
    setEditingId(null);
    setError("");
  };

  // -------------------- RENDER --------------------
  return (
    <div className="App">
      <div className="container">
        {/* Header */}
        <header className="header">
          <h1>🚀 MERN User Management</h1>
          <p className="subtitle">Full Stack CRUD Application</p>
        </header>

        {/* Messages */}
        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <span className="alert-icon">✅</span>
            {success}
          </div>
        )}

        {/* Form Section */}
        <div className="form-card">
          <h2>{editingId ? "✏️ Edit User" : "➕ Add New User"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={loading}
                required
              />
            </div>

            <div className="form-buttons">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading
                  ? "⏳ Processing..."
                  : editingId
                  ? "💾 Update User"
                  : "➕ Add User"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  ❌ Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Users List */}
        <div className="users-card">
          <h2>👥 Users List ({users.length})</h2>

          {loading && users.length === 0 ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="empty-state">
              <p>📭 No users found. Add your first user!</p>
            </div>
          ) : (
            <div className="users-grid">
              {Array.isArray(users) &&
                users.map((user) => (
                  <div key={user._id} className="user-card">
                    <div className="user-avatar">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                      <h3>{user.name}</h3>
                      <p>{user.email}</p>
                      {user.createdAt && (
                        <small className="user-date">
                          📅 {new Date(user.createdAt).toLocaleDateString()}
                        </small>
                      )}
                    </div>
                    <div className="user-actions">
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => handleEdit(user)}
                        title="Edit user"
                        disabled={loading}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDelete(user._id)}
                        title="Delete user"
                        disabled={loading}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="footer">
          <p>Built with ❤️ using MERN Stack</p>
          <p className="tech-stack">
            MongoDB • Express.js • React • Node.js • Docker
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
