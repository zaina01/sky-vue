import request from '../utils/request'

export function loginApi(user) {
  return request({
    url: '/user/login',
    method: 'post',
    data: user,
  })
}

export function register(user) {
  return request({
    url: '/user/register',
    method: 'post',
    data: user,
  })
}

export function changePasswordApi(data) {
  return request({
    url: '/user/change-password',
    method: 'post',
    data: data,
  })
}
