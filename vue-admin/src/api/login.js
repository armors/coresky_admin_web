import request from '@/utils/request'

// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code
  }
  return request({
    url: '/admin/auth/login',
    method: 'post',
    data: data
  })
}
export const getInfo = () => request.post("/admin/auth/info");
export const logout = () => request.post("/admin/auth/logout");
export const getCodeImg = () => request.post("/admin/auth/kaptcha");

