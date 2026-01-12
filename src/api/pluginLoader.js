import request from '../utils/request'

export function getTree() {
  return request({
    url: '/plugin/loader/tree',
    method: 'get',
  })
}

export function getPluginLoade(id) {
  return request({
    url: `/plugin/loader/${id}`,
    method: 'get',
  })
}

export function addPluginLoader(pluginLoader) {
  return request({
    url: '/plugin/loader',
    method: 'post',
    data: pluginLoader,
  })
}

export function deletePluginLoader(id) {
  return request({
    url: `/plugin/loader/${id}`,
    method: 'delete',
    timeout: 25000,
  })
}

export function updatePluginLoader(pluginLoader) {
  return request({
    url: '/plugin/loader',
    method: 'put',
    data: pluginLoader,
  })
}
