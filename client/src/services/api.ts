const BASE_URL = "http://localhost:5000/api";

class ApiClient {
  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Get logged-in user from localStorage
    const storedUser =
      localStorage.getItem("assetflow_session") ||
      localStorage.getItem("assetflow_user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user && user.id) {
          headers["x-user-id"] = user.id;
        }
      } catch (e) {
        console.error("Error parsing stored user:", e);
      }
    }

    return headers;
  }

  private async handleResponse(response: Response) {
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      const errorMsg =
        (data && data.error) || response.statusText || "An error occurred";
      throw new Error(errorMsg);
    }

    return data;
  }

  async get<T = any>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async post<T = any>(endpoint: string, body?: any): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse(response);
  }

  async put<T = any>(endpoint: string, body?: any): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse(response);
  }

  async patch<T = any>(endpoint: string, body?: any): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse(response);
  }

  async delete<T = any>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }
}

export const api = new ApiClient();
export default api;
