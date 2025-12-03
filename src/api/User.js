import request from '../utils/request'

export function login(user) {
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
