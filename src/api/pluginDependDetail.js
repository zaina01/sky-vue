import request from '../utils/request'

export function pluginDependDetailList(queryParams) {
  return request({
    url: '/plugin/depend/detail/list',
    method: 'get',
    params: queryParams,
  })
}

export function removePluginDependDetail(id) {
  return request({
    url: `/plugin/depend/detail/${id}`,
    method: 'delete',
  })
}
