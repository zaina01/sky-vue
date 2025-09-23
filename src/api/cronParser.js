import request from '../utils/request'

export function valid(cron) {
  return request({
    url: '/cron/isValid',
    params: {
      cron: cron,
    },
    method: 'get',
  })
}
export function nextExecutions(cron, count) {
  return request({
    url: `/cron/nextExecutions/${count}`,
    params: {
      cron: cron,
    },
    method: 'get',
  })
}
