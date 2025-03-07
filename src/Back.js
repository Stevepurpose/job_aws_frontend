import axios from "axios";
import { ACCESS_TOKEN } from "./constants";


let apiUrl = import.meta.env.VITE_API_URL
let backendUrl = axios.create({
  baseURL: apiUrl,
  //withCredentials: true,
});

backendUrl.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


backendUrl.interceptors.response.use(
  response=>response,
error=>{
if(!error.response){
  console.error('Network error:', error)
}
return Promise.reject(error)
})


export default backendUrl;