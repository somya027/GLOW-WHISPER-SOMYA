const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

/* ──────────────── token helpers ──────────────── */
let accessToken: string | null = localStorage.getItem("access_token");
let refreshToken: string | null = localStorage.getItem("refresh_token");

export function setTokens(access: string, refresh: string) {
  accessToken = access;
  refreshToken = refresh;
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export function getAccessToken() {
  return accessToken;
}

export function isAuthenticated() {
  return !!accessToken;
}

/* ──────────────── fetch wrapper ──────────────── */

async function tryRefresh(): Promise<boolean> {
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) return false;
    const json = await res.json();
    setTokens(json.data.access_token, json.data.refresh_token);
    return true;
  } catch {
    return false;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean;
}

export async function api<T = unknown>(
  path: string,
  { body, auth = true, ...init }: RequestOptions = {},
): Promise<{ success: boolean; data: T; message: string }> {
  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string>),
  };

  // Don't set Content-Type for FormData (browser sets it with boundary)
  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (auth && accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const fetchOpts: RequestInit = {
    ...init,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  };

  let res = await fetch(`${API_BASE}${path}`, fetchOpts);

  // if 401 and we have a refresh token, try refreshing once
  if (res.status === 401 && auth && refreshToken) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      headers["Authorization"] = `Bearer ${accessToken}`;
      fetchOpts.headers = headers;
      res = await fetch(`${API_BASE}${path}`, fetchOpts);
    }
  }

  const json = await res.json().catch(() => ({ success: false, data: null, message: "Network error" }));

  if (!res.ok) {
    throw new ApiError(json.message || res.statusText, res.status, json);
  }

  return json;
}

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

/* ──────────────── typed helpers ──────────────── */

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    api<{ access_token: string; refresh_token: string; user: unknown }>("/api/auth/login", {
      method: "POST",
      body: { email, password },
      auth: false,
    }),
  register: (name: string, email: string, password: string, mobile?: string) =>
    api<{ access_token: string; refresh_token: string; user: unknown }>("/api/auth/register", {
      method: "POST",
      body: { name, email, password, mobile },
      auth: false,
    }),
  me: () => api<{ id: number; name: string; email: string; mobile: string; role: string }>("/api/auth/me"),
};

// Products
export interface ProductDTO {
  id: number;
  name: string;
  price: number;
  originalPrice: number | null;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  description: string;
  benefits: string[];
  ingredients: string[];
  badge: string | null;
}

export interface PaginatedProducts {
  items: ProductDTO[];
  total_items: number;
  total_pages: number;
  current_page: number;
}

export const productsApi = {
  list: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return api<PaginatedProducts>(`/api/products${qs}`, { auth: false });
  },
  get: (id: number | string) =>
    api<ProductDTO>(`/api/products/${id}`, { auth: false }),
  featured: () =>
    api<ProductDTO[]>("/api/products/featured", { auth: false }),
  trending: () =>
    api<ProductDTO[]>("/api/products/trending", { auth: false }),
};

// Categories
export const categoriesApi = {
  list: () => api<{ id: number; name: string; description: string | null }[]>("/api/categories", { auth: false }),
};

// Cart
export interface CartItemDTO {
  id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  product_image: string;
  quantity: number;
}

export const cartApi = {
  get: () => api<{ items: CartItemDTO[]; total: number }>("/api/cart"),
  add: (product_id: number, quantity = 1) =>
    api("/api/cart/items", { method: "POST", body: { product_id, quantity } }),
  update: (product_id: number, quantity: number) =>
    api(`/api/cart/items/${product_id}`, { method: "PUT", body: { quantity } }),
  remove: (product_id: number) =>
    api(`/api/cart/items/${product_id}`, { method: "DELETE" }),
  clear: () => api("/api/cart/clear", { method: "DELETE" }),
};

// Orders
export interface OrderDTO {
  id: number;
  order_number: string;
  order_status: string;
  total_price: number;
  shipping_address: string | null;
  created_at: string;
  items: { product_id: number; product_name: string; quantity: number; price: number }[];
}

export const ordersApi = {
  list: () => api<{ items: OrderDTO[]; total_items: number; total_pages: number; current_page: number }>("/api/orders"),
  get: (id: number) => api<OrderDTO>(`/api/orders/${id}`),
  create: (shipping_address: string, items: { product_id: number; quantity: number }[]) =>
    api<OrderDTO>("/api/orders", { method: "POST", body: { shipping_address, items } }),
};

// Wishlist
export const wishlistApi = {
  list: () => api<{ product_id: number }[]>("/api/wishlist"),
  toggle: (product_id: number) =>
    api<{ wishlisted: boolean }>(`/api/wishlist/${product_id}`, { method: "POST" }),
};

// Reviews
export const reviewsApi = {
  forProduct: (productId: number | string) =>
    api<{ id: number; user_name: string; rating: number; review_text: string; created_at: string }[]>(
      `/api/products/${productId}/reviews`,
      { auth: false },
    ),
  create: (product_id: number, rating: number, review_text: string) =>
    api("/api/reviews", { method: "POST", body: { product_id, rating, review_text } }),
};

// Search
export const searchApi = {
  log: (query: string) =>
    api("/api/search/log", { method: "POST", body: { query }, auth: false }),
};

// Resolve image URLs – backend serves images under /uploads/…
export function resolveImageUrl(path: string | null | undefined): string {
  if (!path) return "/placeholder.svg";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/uploads")) return `${API_BASE}${path}`;
  return path;
}
