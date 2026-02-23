const API_BASE = "/api";

function getToken(): string | null {
  return localStorage.getItem("token");
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ data?: T; message?: string; status: number }> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers, credentials: "include" });
  const status = res.status;
  const text = await res.text();
  let data: T | undefined;
  let message: string | undefined;
  try {
    const json = text ? JSON.parse(text) : {};
    if (json.message) message = json.message;
    if (json.item !== undefined) data = json.item as T;
    else if (json.items !== undefined) data = json.items as T;
    else if (!json.message) data = json as T;
  } catch {
    message = text || "Erreur inconnue";
  }
  return { data, message, status };
}

export type User = { id: number; email: string; createdAt: string };
export type Address = {
  id: number;
  name: string;
  description: string | null;
  lat: number;
  lng: number;
  createdAt: string;
};

export const users = {
  register: (email: string, password: string) =>
    api<User>("/users", { method: "POST", body: JSON.stringify({ email, password }) }),
  login: (email: string, password: string) =>
    api<{ token: string }>("/users/tokens", { method: "POST", body: JSON.stringify({ email, password }) }),
  me: () => api<User>("/users/me"),
};

export const addresses = {
  list: () => api<Address[]>("/addresses"),
  create: (searchWord: string, name: string, description?: string) =>
    api<Address>("/addresses", {
      method: "POST",
      body: JSON.stringify({ searchWord, name, description: description || "" }),
    }),
  searchNearby: (from: { lat: number; lng: number }, radius: number) =>
    api<Address[]>("/addresses/searches", {
      method: "POST",
      body: JSON.stringify({ from, radius }),
    }),
};
