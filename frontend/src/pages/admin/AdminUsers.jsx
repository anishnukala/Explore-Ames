import React from "react";

function AdminUsers() {
  // 🔒 Frontend-only placeholder data
  const users = [
    {
      id: 1,
      email: "admin@exploreames.com",
      role: "admin",
    },
    {
      id: 2,
      email: "user@exploreames.com",
      role: "user",
    },
    {
      id: 3,
      email: "merch@exploreames.com",
      role: "merch",
    },
  ];

  return (
    <div style={{ padding: "30px" }}>
      <h1>Admin Users</h1>
      <p>This is frontend-only placeholder data (no backend).</p>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr>
            <th style={th}>Email</th>
            <th style={th}>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={td}>{user.email}</td>
              <td style={td}>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = {
  border: "1px solid #ccc",
  padding: "10px",
  background: "#f5f5f5",
  textAlign: "left",
};

const td = {
  border: "1px solid #ccc",
  padding: "10px",
};

export default AdminUsers;