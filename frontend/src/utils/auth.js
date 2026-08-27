const TOKEN_KEY = "taskflow_token";
const EXPIRATION_KEY = "taskflow_token_expiration";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthSession({ token, expiration }) {
  localStorage.setItem(TOKEN_KEY, token);

  if (expiration) {
    localStorage.setItem(EXPIRATION_KEY, expiration);
  }
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRATION_KEY);
}

export function isTokenExpired() {
  const token = getToken();

  if (!token) {
    return true;
  }

  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return true;
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = window.atob(
      normalized + "=".repeat((4 - (normalized.length % 4)) % 4),
    );

    const parsed = JSON.parse(decoded);
    const expiry = Number(parsed.exp || 0);

    if (!expiry) {
      return false;
    }

    return Date.now() >= expiry * 1000;
  } catch {
    return true;
  }
}

export function getCurrentUser() {
  const token = getToken();

  if (!token) {
    return null;
  }

  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = window.atob(
      normalized + "=".repeat((4 - (normalized.length % 4)) % 4),
    );

    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function getCurrentUserRole() {
  const user = getCurrentUser();

  if (!user) {
    return null;
  }

  const roleCandidates = [
    user.role,
    user["role"],
    user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
    user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"],
  ];

  for (const candidate of roleCandidates) {
    if (!candidate) continue;

    const value = Array.isArray(candidate) ? candidate[0] : candidate;
    if (value) return value;
  }

  return null;
}
