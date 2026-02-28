// src/services/jobLog-websocket.service.js
import websocketManager from '@/utils/websocket-manager'

class JobLogWebSocketService {
  constructor() {
    // 如果是单例模式，检查是否已存在实例
    if (JobLogWebSocketService.instance) {
      return JobLogWebSocketService.instance
    }
    this.endpointName = 'jobLog'
    this.endpointPath = '/ws/jobLog'

    // 存储事件监听器引用，便于后续清理
    this.eventListeners = {
      onConnect: null,
      onDisconnect: null,
    }

    // 从管理器获取或注册端点
    this.ws =
      websocketManager.getEndpoint(this.endpointName) ||
      websocketManager.registerEndpoint(this.endpointName, this.endpointPath, {
        reconnectDelay: 3000,
        maxReconnectAttempts: 10,
      })

    // 在注册新监听器前，清理旧的监听器
    this.cleanupEventListeners()

    // 注册新监听器
    this.registerEventListeners()

    // 保存为单例
    JobLogWebSocketService.instance = this

    // 添加页面卸载时的清理
    this.setupPageCleanup()
  }
  static getInstance() {
    if (!JobLogWebSocketService.instance) {
      JobLogWebSocketService.instance = new JobLogWebSocketService()
    }
    return JobLogWebSocketService.instance
  }

  async connect() {
    try {
      // 如果已连接，直接返回
      if (this.ws && this.ws.isConnected) {
        console.log('JobLog WebSocket 已连接，跳过重复连接')
        return true
      }
      const result = await websocketManager.connectEndpoint(this.endpointName)
      // 注册事件监听器（只注册一次）
      if (!this.listenersRegistered) {
        this.registerEventListeners()
        this.listenersRegistered = true
      }
      return result
    } catch (error) {
      console.error('JobLog WebSocket连接失败:', error)
      return false
    }
  }

  subscribeToTask(taskId, callback) {
    return this.ws.subscribe(`/topic/jobLog/${taskId}`, callback)
  }
  unsubscribeToTask(subId) {
    return this.ws.unsubscribe(subId)
  }
  subscribeToTaskByUser(taskId, callback) {
    return this.ws.subscribe(`/user/jobLog/${taskId}`, callback)
  }
  // subscribeTask(taskData) {
  //   return this.ws.send('/app/jobLog/subscribe', taskData)
  // }
  // unsubscribeTask(taskData) {
  //   return this.ws.send('/app/jobLog/unsubscribe', taskData)
  // }

  // subscribeToAllTasks(callback) {
  //   return this.ws.subscribe('/topic/task/all', callback);
  // }

  // getTaskList() {
  //   return this.ws.send('/app/task/list', {});
  // }
  // 注册事件监听器
  registerEventListeners() {
    const onConnectHandler = () => {
      console.log('✅ 任务WebSocket连接成功（单例模式）')
    }

    const onDisconnectHandler = () => {
      console.log('🔌 任务WebSocket断开连接成功')
    }

    this.ws.on('onConnect', onConnectHandler)
    this.ws.on('onDisconnect', onDisconnectHandler)

    // 保存引用以便后续清理
    this.eventListeners.onConnect = onConnectHandler
    this.eventListeners.onDisconnect = onDisconnectHandler
  }
  // 清理事件监听器
  cleanupEventListeners() {
    if (this.eventListeners.onConnect) {
      this.ws.off('onConnect', this.eventListeners.onConnect)
    }
    if (this.eventListeners.onDisconnect) {
      this.ws.off('onDisconnect', this.eventListeners.onDisconnect)
    }
    this.eventListeners.onConnect = null
    this.eventListeners.onDisconnect = null
  }
  // 设置页面卸载时的清理
  setupPageCleanup() {
    if (typeof window !== 'undefined') {
      // 监听页面卸载
      window.addEventListener('beforeunload', () => {
        this.cleanupEventListeners()
      })

      // // 监听页面隐藏/显示
      // window.addEventListener('visibilitychange', () => {
      //   if (document.hidden) {
      //     // 页面隐藏时，可以清理或暂停WebSocket
      //     this.ws.pause()
      //   } else {
      //     // 页面重新显示时，恢复WebSocket
      //     this.ws.resume()
      //   }
      // })
    }
  }
  disconnect() {
    this.cleanupEventListeners()
    this.ws.disconnect()
  }
}

export default JobLogWebSocketService.getInstance()
