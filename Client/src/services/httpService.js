const BASE_URL = process.env.REACT_PUBLIC_API_URL

class HttpService{
  #getAuthHeaders(){
    const token = localStorage.getItem('token');
    return {
      "content-Type": "application/json",
      ...(token && {Authorization:`Bearer ${token}`}),
    }
  };

  getHeaders()
}