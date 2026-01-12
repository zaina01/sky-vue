import request from '../utils/request'

export function pluginDependList(queryParams) {
  return request({
    url: '/plugin/depend/list',
    method: 'get',
    params: queryParams,
  })
}

export function removePluginDepend(id) {
  return request({
    url: `/plugin/depend/${id}`,
    method: 'delete',
  })
}

export function installPluginDepend(data) {
  return request({
    url: '/plugin/depend',
    method: 'post',
    data: data,
  })
}
