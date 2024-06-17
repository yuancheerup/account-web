import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

const baseURL = 'http://localhost:8080'

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL, // 基础地址
  timeout: 10000 // 超时时间
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token
    const userToken = JSON.parse(localStorage.getItem('big-user' || {}))
    if (userToken) {
      config.headers.Authorization = userToken.token
    }
    // console.log('Request config:', config) // 调试信息
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // TODO 3. 处理业务失败
    // TODO 4. 摘取核心响应数据
    if (res.data.code === 1) {
      return res
    }
    ElMessage.error(res.data.msg || '服务异常')
    return Promise.reject(res.data)
  },
  (error) => {
    // TODO 5. 处理401错误
    // 错误的特殊情况 401权限不足 或 token 过期
    if (error.response?.status === 401) {
      // 移除无效token
      localStorage.removeItem('big-user')
      router.push('/login')
    }

    // 错误的默认情况
    ElMessage.error(error.request.data.message || '服务异常')
    return Promise.reject(error)
  }
)

export default instance
export { baseURL }
