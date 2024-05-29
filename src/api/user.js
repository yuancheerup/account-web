import request from '../utils/request'

// 登录接口
export const userLoginService = ({ username, password }) => {
  return request.post('/user/login', { username: username, password: password })
}

// 注册接口
export const userRegisterService = ({ username, password, repassword }) => {
  return request.post('/user/register', (username, password, repassword))
}
