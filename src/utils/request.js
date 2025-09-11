import axios from "axios";
import baseUrl from "@/utils/base";
axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  // baseURL: "https://602bde0f.r12.cpolar.top",
  baseURL: baseUrl,
  // 超时
  timeout: 10000,
});

export default service;
