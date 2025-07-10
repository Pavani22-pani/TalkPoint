// import axios from "axios";

// export const axiosInstance = axios.create({
//   // baseURL: import.meta.env.MODE === "development"
//   //   ? "http://localhost:5001/api"
//   //   : "/api",
//   // withCredentials: true,
//   baseURL: import.meta.env.MODE === "development"
//   ? "http://localhost:5001/api"
//   : "https://talkpoint-api.onrender.com/api"

// });


import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development"
    ? "http://localhost:5001/api"
    : "/api", // Production: frontend and backend served from same origin
  withCredentials: true,
});
