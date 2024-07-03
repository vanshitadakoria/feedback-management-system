// import axios from "axios"

// const apiURL = "https://localhost:7163/api"

// Set the default Authorization header for Axios
// axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
export const getCurrentUser = () => {
    return localStorage.getItem('token');
  };
  
  export const setToken = (token) => {
    localStorage.setItem('token', token);
  };
  
  export const clearToken = () => {
    localStorage.removeItem('token');
  };
  export const getCurrentLoggedInUser = () => {
    return JSON.parse(sessionStorage.getItem('user'));
  };
