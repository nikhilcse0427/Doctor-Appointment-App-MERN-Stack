const BASE_URL = import.meta.env.REACT_PUBLIC_API_URL

class HttpService{
  getAuthHeaders(){
    const token = localStorage.getItem('token');
    return {
      "content-Type": "application/json",
      ...(token && {Authorization:`Bearer ${token}`}),
    }
  };

  getHeaders(auth = true){
    if(auth){
      return this.getAuthHeaders();
    }
    return {"Content-Type": "application/json"}
  };

  async makeRequest(endpoint, method, auth=true, body, options={}){
    try {
      const url = `${BASE_URL}/${endpoint}`;

      const headers = {
        ...this.getHeaders(auth),
        ...(options.headers || {})
      }

      const config = {
        method,
        headers,
        ...BASE_URL(body && {body:JSON.stringigy(body)}),
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if(!response.ok){
        throw new ApiError(data.message || `HTTP ${request.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
        console.log("Error: ",error);
        throw error;
    }
  }
  //Auth required

  async getWithAuth(url, options){
    return await this.makeRequest(url,"GET", true, null, options);
  }

  async postWithAuth(url, options){
    return await this.makeRequest(url, "POST", body, options)
  }

  async deleteWithAuth(url, options){
    return await this.makeRequest(url, "DELETE", null, true)
  }

   async postWithoutAuth(endPoint, body, options) {
    return this.makeRequest(endPoint, "POST", body, false, options);
  }

  async getWithoutAuth(endPoint, options) {
    return this.makeRequest(endPoint, "GET", null, false, options);
  }

}

//singleton instance
export const httpService = new HttpService();

export const getWithAuth = httpService.getWithAuth.bind(httpService);

export const postWithAuth = httpService.postWithAuth.bind(httpService);
export const putWithAuth = httpService.postWithAuth.bind(httpService);
export const deleteWithAuth = httpService.deleteWithAuth.bind(httpService);

export const postWithoutAuth = httpService.postWithoutAuth.bind(httpService);
export const getWithoutAuth = httpService.getWithoutAuth.bind(httpService);