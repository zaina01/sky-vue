import request from '../utils/request'

export function addJob(data) {
  return request({
    url: '/job',
    method: 'post',
    data: data,
  })
}
export function updateJob(data) {
  return request({
    url: '/job',
    method: 'put',
    data: data,
  })
}
export function deleteJob(id) {
  return request({
    url: `/job/${id}`,
    method: 'delete',
  })
}
export function selectJobById(id) {
  return request({
    url: `/job/${id}`,
    method: 'get',
  })
}
export function selectJobList() {
  return request({
    url: '/job',
    method: 'get',
  })
}
export function updateStatus(data) {
  return request({
    url: '/job/status',
    method: 'put',
    data: data,
  })
}
