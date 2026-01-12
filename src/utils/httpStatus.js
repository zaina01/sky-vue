// src/utils/httpStatus.js
// 处理从 Nginx 传递的原始状态码

// 存储原始状态码
let originalStatusCode = null

/**
 * 从响应头获取原始状态码
 */
export function getOriginalStatusCode() {
  if (originalStatusCode) {
    return originalStatusCode
  }

  // 从 localStorage 获取（页面刷新后）
  const stored = localStorage.getItem('original_http_status')
  if (stored) {
    originalStatusCode = parseInt(stored, 10)
    return originalStatusCode
  }

  return null
}

/**
 * 设置原始状态码
 */
export function setOriginalStatusCode(status) {
  originalStatusCode = status
  // 存储到 localStorage 以便页面刷新后仍能获取
  if (status) {
    localStorage.setItem('original_http_status', status.toString())
  } else {
    localStorage.removeItem('original_http_status')
  }
}

/**
 * 清除原始状态码
 */
export function clearStatusCode() {
  originalStatusCode = null
  localStorage.removeItem('original_http_status')
}

/**
 * 检查是否是 5xx 错误
 */
export function isServerError(status) {
  return status >= 500 && status < 600
}

/**
 * 获取错误描述
 */
export function getErrorDescription(code) {
  const descriptions = {
    500: '服务器内部错误',
    502: '网关错误 - 后端服务无响应',
    503: '服务不可用 - 服务器维护或过载',
    504: '网关超时 - 后端响应超时',
    404: '页面未找到',
    403: '禁止访问',
    401: '未授权',
  }
  return descriptions[code] || '未知错误'
}
