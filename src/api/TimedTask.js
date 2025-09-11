import request from '../utils/request'

export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid,
  }
  return request({
    url: '/login',
    headers: {
      isToken: false,
      repeatSubmit: false,
    },
    method: 'post',
    data: data,
  })
}
