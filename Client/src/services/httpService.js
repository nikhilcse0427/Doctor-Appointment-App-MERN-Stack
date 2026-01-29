const BASE_URL = import.meta.env.VITE_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL;

class HttpService {
  getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  getHeaders(auth = true) {
    if (auth) {
      return this.getAuthHeaders();
    }
    return { "Content-Type": "application/json" };
  }

  async makeRequest(endPoint, method, body, auth = true, options) {
    try {
      // Handle URL construction properly - remove trailing slash from BASE_URL and ensure endPoint starts with /
      const baseUrl = BASE_URL?.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
      const cleanEndPoint = endPoint.startsWith('/') ? endPoint : `/${endPoint}`;
      const url = `${baseUrl}${cleanEndPoint}`;
      const headers = {
        ...this.getHeaders(auth),
        ...(options?.headers || {}),
      };

      const config = {
        method,
        headers,
        ...(body && { body: JSON.stringify(body) }),
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error [${method} ${endPoint}]:`, error);
      throw error;
    }
  }

  // Auth methods
  getWithAuth(endPoint, options) {
    return this.makeRequest(endPoint, "GET", null, true, options);
  }

  postWithAuth(endPoint, body, options) {
    return this.makeRequest(endPoint, "POST", body, true, options);
  }

  putWithAuth(endPoint, body, options) {
    return this.makeRequest(endPoint, "PUT", body, true, options);
  }

  deleteWithAuth(endPoint, options) {
    return this.makeRequest(endPoint, "DELETE", null, true, options);
  }

  // Without Auth
  postWithoutAuth(endPoint, body, options) {
    return this.makeRequest(endPoint, "POST", body, false, options);
  }

  getWithoutAuth(endPoint, options) {
    return this.makeRequest(endPoint, "GET", null, false, options);
  }
}

// Export instance
export const httpService = new HttpService();

// Bind functions to instance
export const getWithAuth = httpService.getWithAuth.bind(httpService);
export const postWithAuth = httpService.postWithAuth.bind(httpService);
export const putWithAuth = httpService.putWithAuth.bind(httpService);
export const deleteWithAuth = httpService.deleteWithAuth.bind(httpService);

export const postWithoutAuth = httpService.postWithoutAuth.bind(httpService);
export const getWithoutAuth = httpService.getWithoutAuth.bind(httpService);
