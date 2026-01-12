// src/utils/errorHandler.js
export const setupErrorHandler = (router) => {
  // Vue 全局错误处理器
  const errorHandler = (err, vm, info) => {
    console.error('Vue 错误:', err)
    console.error('组件:', vm?.$options?.name)
    console.error('位置:', info)

    // 跳转到错误页面
    router.push({
      name: 'ErrorPage',
      params: { code: '500' },
      query: {
        error: encodeURIComponent(
          JSON.stringify({
            message: err.message,
            stack: err.stack,
            component: vm?.$options?.name,
            info: info,
          }),
        ),
      },
    })

    // 可以发送错误到监控服务
    sendToErrorTracking(err)
  }

  // 未处理的 Promise 错误
  window.addEventListener('unhandledrejection', (event) => {
    console.error('未处理的 Promise 错误:', event.reason)
    if (event.reason.status == 200) return
    router.push({
      name: 'ErrorPage',
      params: { code: '500' },
      query: {
        error: encodeURIComponent(
          JSON.stringify({
            type: 'unhandledrejection',
            reason: event.reason?.toString(),
          }),
        ),
      },
    })

    event.preventDefault()
  })

  // 网络错误监听
  window.addEventListener('error', (event) => {
    if (event.target.tagName === 'IMG' || event.target.tagName === 'SCRIPT') {
      console.error('资源加载失败:', event.target.src || event.target.href)
    }
  })

  return errorHandler
}

// 发送错误到监控服务
const sendToErrorTracking = (error) => {
  if (import.meta.env.PROD) {
    // 生产环境下发送错误日志
    const errorData = {
      url: window.location.href,
      message: error.message,
      stack: error.stack,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    }

    // 使用 navigator.sendBeacon 发送，即使页面关闭也能发送
    // navigator.sendBeacon('/api/log/error', JSON.stringify(errorData));
    console.log(JSON.stringify(errorData))
  }
}
