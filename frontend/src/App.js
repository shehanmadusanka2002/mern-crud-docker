import React, { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  
  // Use environment variable or fallback to localhost for development
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    const res = await fetch(`${API_URL}/users`);
    setUsers(await res.json());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", email: "" });
    fetchUsers();
  };

  return (
    <div className="App">
      <h1>MERN CRUD App</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <button type="submit">Add User</button>
      </form>

      <ul>
        {users.map(u => (
          <li key={u._id}>{u.name} - {u.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
