// Shared API client for backend communication
import type { User, Role } from "@fishtank/shared-types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

/**
 * Base API client
 */
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();

/**
 * Auth API
 */
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<{ user: User; token: string }>("/auth/login", { email, password }),
  
  register: (data: { email: string; password: string; name: string; role: Role }) =>
    apiClient.post<{ user: User; token: string }>("/auth/register", data),
  
  logout: () =>
    apiClient.post("/auth/logout", {}),
  
  getCurrentUser: () =>
    apiClient.get<User>("/auth/me"),
};

/**
 * Users API
 */
export const usersApi = {
  getProfile: (userId: string) =>
    apiClient.get<User>(`/users/${userId}`),
  
  updateProfile: (userId: string, data: Partial<User>) =>
    apiClient.put<User>(`/users/${userId}`, data),
};

// Add more API endpoints as needed

