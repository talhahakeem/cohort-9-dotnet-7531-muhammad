import { clearAuthSession, getToken, isTokenExpired } from "../utils/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://localhost:7287/api";

const getErrorMessage = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  const isJsonLike =
    contentType.includes("application/json") ||
    contentType.includes("application/problem+json");

  if (isJsonLike) {
    try {
      const payload = await response.json();

      if (payload?.message) {
        return payload.message;
      }

      if (payload?.errors) {
        const messages = Object.values(payload.errors)
          .flatMap((value) => (Array.isArray(value) ? value : [value]))
          .filter(Boolean);

        if (messages.length > 0) {
          return messages.join(" ");
        }
      }

      if (payload?.title) return payload.title;
      if (typeof payload === "string") return payload;
      return `Request failed with status ${response.status}`;
    } catch {
      // ignore JSON parse failure and fall back to text
    }
  }

  try {
    const text = await response.text();
    if (text) return text;
  } catch {
    // ignore text parse failure
  }

  return `Request failed with status ${response.status}`;
};

const request = async (endpoint, options = {}) => {
  const token = getToken();

  if (token && isTokenExpired()) {
    clearAuthSession();
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && !isTokenExpired()
        ? { Authorization: `Bearer ${token}` }
        : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const message = await getErrorMessage(response);

    if (response.status === 401 || response.status === 403) {
      clearAuthSession();
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

export const authApi = {
  register: (data) =>
    request("/Auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data) =>
    request("/Auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  profile: () => request("/Auth/profile"),
};

export const dashboardApi = {
  getStats: () => request("/Dashboard/stats"),
};

export const profileApi = {
  getProfile: () => request("/Profile"),
};

export const adminUserApi = {
  getAll: () => request("/AdminUsers"),
  getById: (userId) => request(`/AdminUsers/${userId}`),
  update: (userId, data) =>
    request(`/AdminUsers/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (userId) =>
    request(`/AdminUsers/${userId}`, {
      method: "DELETE",
    }),
};

export const taskApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        value !== "All"
      ) {
        query.append(key, value);
      }
    });

    const queryString = query.toString();
    return request(`/Tasks${queryString ? `?${queryString}` : ""}`);
  },

  getById: (id) => request(`/Tasks/${id}`),

  create: (data) =>
    request("/Tasks", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    request(`/Tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    request(`/Tasks/${id}`, {
      method: "DELETE",
    }),
};

export default request;
