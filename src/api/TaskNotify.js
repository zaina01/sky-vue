import request from '../utils/request'

export function getServices() {
  return request({
    url: '/notify/services',
    method: 'get',
  })
}
export function getNotifyList() {
  return request({
    url: '/notify',
    method: 'get',
  })
}

export function getNotifyData(notifyId) {
  return request({
    url: `/notify/data/${notifyId}`,
    method: 'get',
  })
}

export function addNotify(notifyName) {
  return request({
    url: `/notify/${notifyName}`,
    method: 'post',
  })
}

export function deleteNotif(notifyId) {
  return request({
    url: `/notify/${notifyId}`,
    method: 'delete',
  })
}
export function updateNotifyData(notifyId, data) {
  return request({
    url: `/notify/${notifyId}`,
    method: 'put',
    data: data,
  })
}
export function getNotifyDataColumn(notifyId) {
  return request({
    url: `/notify/dataColumn/${notifyId}`,
    method: 'get',
  })
}
