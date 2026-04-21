// frontend/src/utils/auth.js
const USER_KEY = "user";
const TOKEN_KEY = "token";

export function loginUser(user, token) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  if (token) localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event("authchange"));
}

export function logoutUser() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event("authchange"));
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function isLoggedIn() {
  return !!getUser();
}

export function hasRole(role) {
  const u = getUser();
  return u?.role === role;
}