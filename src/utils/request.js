import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router' // 直接导入路由实例
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
const request = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  // baseURL: "https://602bde0f.r12.cpolar.top",
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  // 超时
  timeout: 10000,
})
request.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken')

    // 如果 token 存在，将其添加到请求头中
    if (token) {
      config.headers['Authorization'] = token
      // 注意：您的响应中返回的 token 已包含 "Bearer " 前缀
      // 所以这里直接使用 token 即可，不需要再添加 "Bearer "
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器 - 统一处理错误和 token 过期
request.interceptors.response.use(
  (response) => {
    // 对响应数据做些处理，比如直接返回 data
    if (response.data && response.data.code === 200) {
      return response.data
    } else {
      // 处理业务逻辑错误
      // ElMessage.error(response.data.msg || '请求失败')
      return Promise.reject(response.data)
    }
  },
  (error) => {
    // 处理 HTTP 错误状态码
    if (error.response) {
      switch (error.response.status) {
        case 401:
          ElMessage.error('登录已过期，请重新登录')
          // 清除 token 并跳转到登录页
          localStorage.removeItem('userToken')
          sessionStorage.removeItem('userToken')
          router.push('/login')
          break
        case 403:
          ElMessage.error('没有权限访问')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        default:
          ElMessage.error(`请求错误: ${error.response.status}`)
      }
    } else {
      ElMessage.error('网络错误，请检查网络连接')
    }
    return Promise.reject(error)
  },
)

export default request
