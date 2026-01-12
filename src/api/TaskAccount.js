import request from '../utils/request'

export function getAccounts(jobId) {
  return request({
    url: '/plugin/account/accounts/' + jobId,
    method: 'get',
  })
}

export function getAccount(jobId, id) {
  return request({
    url: `/plugin/account/account/${jobId}/${id}`,
    method: 'get',
  })
}

export function addAccount(jobId, account) {
  return request({
    url: `/plugin/account/account/${jobId}`,
    method: 'post',
    data: account,
  })
}

export function deleteAccount(jobId, id) {
  return request({
    url: `/plugin/account/account/${jobId}/${id}`,
    method: 'delete',
  })
}
export function updateAccount(jobId, account) {
  return request({
    url: `/plugin/account/account/${jobId}`,
    method: 'put',
    data: account,
  })
}
export function getAccountColumn(jobId) {
  return request({
    url: `/plugin/account/column/${jobId}`,
    method: 'get',
  })
}
