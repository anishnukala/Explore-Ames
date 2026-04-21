import api from "./api";

export const fetchUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

export const fetchUserStats = async () => {
  const res = await api.get("/users/stats");
  return res.data;
};

// ✅ CREATE user must use auth signup endpoint
export const createUserApi = async (payload) => {
  const res = await api.post("/auth/signup", payload);
  return res.data;
};

// ✅ UPDATE user
export const updateUserApi = async (id, payload) => {
  const res = await api.put(`/users/${id}`, payload);
  return res.data;
};

// ✅ DELETE user
export const deleteUserApi = async (id) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};