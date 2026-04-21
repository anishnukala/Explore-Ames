// src/utils/usersStore.js

const KEY = "ea_users_v1"; // ✅ one single key everywhere

// ✅ Your seed users (these will show in Admin dashboard)
const SEED_USERS = [
  {
    id: "id1",
    name: "Prajwal",
    email: "prajwal@expames.com",
    password: "prajwal123",
    role: "user",
    createdAt: new Date().toISOString(),
  },
  {
    id: "id2",
    name: "Anish",
    email: "anish@expames.com",
    password: "admin123",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "id3",
    name: "Merch",
    email: "merch@expames.com",
    password: "merch123",
    role: "merch",
    createdAt: new Date().toISOString(),
  },
];

function emitChange() {
  window.dispatchEvent(new Event("userschange"));
}

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : null;
    return Array.isArray(arr) ? arr : null;
  } catch {
    return null;
  }
}

function write(users) {
  localStorage.setItem(KEY, JSON.stringify(users));
  emitChange();
}

/**
 * ✅ Ensures seed exists ONCE (first run).
 * If storage is empty/broken -> writes SEED_USERS.
 */
export function ensureSeedUsers() {
  const existing = read();
  if (existing && existing.length > 0) return existing;

  // write seeds
  write(SEED_USERS);
  return SEED_USERS;
}

export function getAllUsers() {
  return ensureSeedUsers();
}

// ✅ stats for top boxes
export function getStats() {
  const users = getAllUsers();
  const total = users.length;
  const admins = users.filter((u) => u.role === "admin").length;
  const members = users.filter((u) => u.role === "user").length;
  const guests = 0; // guests are not stored in this localStorage store
  return { total, admins, members, guests };
}

// ✅ id1 id2 id3 style
function nextId(users) {
  let max = 0;
  for (const u of users) {
    const n = Number(String(u.id || "").replace("id", ""));
    if (!Number.isNaN(n)) max = Math.max(max, n);
  }
  return `id${max + 1}`;
}

export function createUser({ name, email, role = "user", password }) {
  const users = getAllUsers();

  const cleanEmail = String(email || "").trim().toLowerCase();
  if (!cleanEmail) throw new Error("Email required.");

  const exists = users.some((u) => u.email.toLowerCase() === cleanEmail);
  if (exists) throw new Error("Email already exists.");

  const newUser = {
    id: nextId(users),
    name: String(name || "").trim() || "User",
    email: cleanEmail,
    password: String(password || "user123"),
    role,
    createdAt: new Date().toISOString(),
  };

  const updated = [newUser, ...users]; // newest first
  write(updated);
  return newUser;
}

export function updateUser(id, patch) {
  const users = getAllUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error("User not found.");

  const current = users[idx];
  const updatedUser = {
    ...current,
    ...patch,
    email: patch.email ? String(patch.email).trim().toLowerCase() : current.email,
    name: patch.name ? String(patch.name).trim() : current.name,
  };

  const updated = [...users];
  updated[idx] = updatedUser;
  write(updated);
  return updatedUser;
}

export function deleteUser(id) {
  const users = getAllUsers();
  const updated = users.filter((u) => u.id !== id);
  write(updated);
  return true;
}

// ✅ login helper (what your Login.jsx should use)
export function findUserByCredentials(role, email, password) {
  const users = getAllUsers();
  const e = String(email || "").trim().toLowerCase();
  const p = String(password || "").trim();
  const r = String(role || "").trim();

  return users.find(
    (u) =>
      (u.role || "").trim() === r &&
      (u.email || "").toLowerCase() === e &&
      String(u.password || "") === p
  );
}

// Optional: wipe + reseed (use in console if needed)
export function resetUsersToSeed() {
  write(SEED_USERS);
  return SEED_USERS;
}