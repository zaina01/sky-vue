import request from '../utils/request'

export function selectJobLogList(jobId, pageNum, pageSize) {
  return request({
    url: '/log',
    method: 'get',
    params: {
      jobId,
      pageNum,
      pageSize,
    },
  })
}
