import axios from "axios";
const baseUrl = "http://localhost/core/api";
// const baseUrl = "http://localhost:8080/api";

export const apiClient = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const crawlApi = axios.create({
  baseURL: "http://localhost/crawl/crawl",
  // withCredentials: true,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const financeApi = axios.create({
  baseURL: "http://localhost/finance/finance",
  // withCredentials: true,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});
export const marketApi = axios.create({
  baseURL: "http://localhost/market/market",
  // withCredentials: true,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const searchApi = axios.create({
  baseURL: "http://localhost/search/search",
  // withCredentials: true,
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
});
