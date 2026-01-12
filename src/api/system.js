import request from '../utils/request'

export function restart() {
  return request({
    url: '/system/restart',
    method: 'post',
  })
}
