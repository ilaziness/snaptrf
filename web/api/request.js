import axios from "axios";
import config from "@/config";

const api = axios.create({
  baseURL: config.apiHost,
  headers: { post: { "Content-Type": "application/json" } },
});

export default api;
