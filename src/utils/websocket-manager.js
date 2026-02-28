// src/utils/websocket-manager.js
import { Client } from '@stomp/stompjs'

class WebSocketEndpoint {
  constructor(endpoint, options = {}) {
    this.endpoint = endpoint
    this.stompClient = null
    this.isConnected = false
    this.subscriptions = new Map()
    this.callbacks = {
      onConnect: [],
      onDisconnect: [],
      onError: [],
    }
    this.options = Object.assign(
      {
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        maxReconnectAttempts: 5,
        debug: false, // 新增调试选项
      },
      options,
    )
    this.reconnectAttempts = 0
  }

  connect() {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken')
      console.log('🔑 Token:', token ? '已获取' : '未找到')
      const baseUrl = import.meta.env.VITE_APP_API_BASE_URL
      let wsUrl
      if (baseUrl.startsWith('http')) {
        // 如果是完整的 URL
        const wsProtocol = baseUrl.startsWith('https') ? 'wss:' : 'ws:'
        const wsHost = baseUrl.replace(/^https?:\/\//, '')
        wsUrl = `${wsProtocol}//${wsHost}${this.endpoint}`
      } else if (baseUrl.startsWith('/')) {
        // 如果是相对路径，使用当前页面的协议和主机
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        const host = window.location.host
        const path = baseUrl === '/' ? '' : baseUrl

        // 如果 endpoint 已经是完整路径，可以直接使用
        if (this.endpoint.startsWith('/')) {
          wsUrl = `${protocol}//${host}${path}${this.endpoint}`
        } else {
          wsUrl = `${protocol}//${host}${path}/${this.endpoint}`
        }
      }
      console.log(`WebSocket 连接地址: ${wsUrl}`)

      this.stompClient = new Client({
        brokerURL: wsUrl, // 使用 brokerURL 而不是 webSocketFactory
        connectHeaders: {
          Authorization: token, // JWT 方式
        },
        reconnectDelay: this.options.reconnectDelay,
        heartbeatIncoming: this.options.heartbeatIncoming,
        heartbeatOutgoing: this.options.heartbeatOutgoing,
        debug: (str) => {
          if (this.options.debug) {
            console.log(`[STOMP Debug] ${str}`)
            if (str.includes('>>> CONNECT')) {
              console.log('✅ STOMP CONNECT 帧已发送，包含 Authorization 头')
            }
          }
        },

        onConnect: (frame) => {
          console.log(`WebSocket 连接成功 [${this.endpoint}]:`, frame)
          this.isConnected = true
          this.reconnectAttempts = 0
          this.callbacks.onConnect.forEach((callback) => callback(frame))
          resolve(frame)
        },

        onStompError: (frame) => {
          console.error(`STOMP协议错误 [${this.endpoint}]:`, frame)
          console.error('❌ STOMP 错误:')
          console.error('- 命令:', frame.command)
          console.error('- 头部:', frame.headers)
          console.error('- 消息:', frame.body)
          if (
            frame.headers['message']?.includes('auth') ||
            frame.headers['message']?.includes('401') ||
            frame.headers['message']?.includes('403')
          ) {
            console.error('⚠️ 认证失败！请检查 token')
          }
          this.callbacks.onError.forEach((callback) => callback(frame))
          reject(frame)
        },

        onWebSocketError: (error) => {
          console.error(`WebSocket连接错误 [${this.endpoint}]:`, error)
          this.callbacks.onError.forEach((callback) => callback(error))
          this.handleReconnect()
          reject(error)
        },

        onDisconnect: () => {
          console.log(`WebSocket 断开连接 [${this.endpoint}]`)
          this.isConnected = false
          this.callbacks.onDisconnect.forEach((callback) => callback())
        },
      })

      this.stompClient.activate()
    })
  }

  // 其他方法保持不变...
  subscribe(destination, callback) {
    if (!this.isConnected || !this.stompClient) {
      console.error(`WebSocket未连接 [${this.endpoint}]`)
      return null
    }
    // 生成全局唯一的ID，包含标签页标识
    // 生成标签页唯一ID
    const tabId =
      localStorage.getItem('ws_tab_id') ||
      `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('ws_tab_id', tabId)
    // 生成订阅ID
    const subId = `sub_${tabId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const headers = {
      id: subId,
    }
    const subscription = this.stompClient.subscribe(
      destination,
      (message) => {
        try {
          const data = JSON.parse(message.body)
          callback(data, message)
        } catch (error) {
          console.error('解析消息失败:', error)
          callback(message.body, message)
        }
      },
      headers,
    )
    console.log('subscription=>', subscription)
    // const subId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    this.subscriptions.set(subId, { subscription, destination })

    return subId
  }

  send(destination, body, headers = {}) {
    if (!this.isConnected || !this.stompClient) {
      console.error(`WebSocket未连接 [${this.endpoint}]`)
      return false
    }

    this.stompClient.publish({
      destination,
      body: typeof body === 'string' ? body : JSON.stringify(body),
      headers,
    })

    return true
  }

  unsubscribe(subId) {
    const sub = this.subscriptions.get(subId)
    if (sub) {
      sub.subscription.unsubscribe()
      this.subscriptions.delete(subId)
    }
  }

  disconnect() {
    this.subscriptions.forEach((sub) => sub.subscription.unsubscribe())
    this.subscriptions.clear()

    if (this.stompClient) {
      this.stompClient.deactivate()
      this.stompClient = null
    }

    this.isConnected = false
  }

  on(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event].push(callback)
    }
  }

  off(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event] = this.callbacks[event].filter((cb) => cb !== callback)
    }
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.options.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        console.log(
          `尝试重连 [${this.endpoint}] (${this.reconnectAttempts}/${this.options.maxReconnectAttempts})`,
        )
        this.connect()
      }, 3000)
    }
  }
}

class WebSocketManager {
  constructor() {
    this.endpoints = new Map()
  }

  registerEndpoint(name, endpoint, options = {}) {
    if (this.endpoints.has(name)) {
      console.warn(`端点 ${name} 已存在，将被覆盖`)
      this.unregisterEndpoint(name)
    }

    const wsEndpoint = new WebSocketEndpoint(endpoint, options)
    this.endpoints.set(name, wsEndpoint)

    return wsEndpoint
  }

  getEndpoint(name) {
    return this.endpoints.get(name)
  }

  async connectEndpoint(name) {
    const endpoint = this.getEndpoint(name)
    if (!endpoint) {
      throw new Error(`端点 ${name} 未注册`)
    }
    console.log(`开始连接端点 ${name} `)
    return endpoint.connect()
  }

  async connectAll() {
    const results = {}
    for (const [name, endpoint] of this.endpoints.entries()) {
      try {
        await endpoint.connect()
        results[name] = { success: true }
      } catch (error) {
        results[name] = { success: false, error }
      }
    }
    return results
  }

  unregisterEndpoint(name) {
    const endpoint = this.endpoints.get(name)
    if (endpoint) {
      endpoint.disconnect()
      this.endpoints.delete(name)
    }
  }

  disconnectAll() {
    this.endpoints.forEach((endpoint) => endpoint.disconnect())
  }

  sendToEndpoint(name, destination, body, headers = {}) {
    const endpoint = this.getEndpoint(name)
    if (!endpoint) {
      console.error(`端点 ${name} 不存在`)
      return false
    }

    return endpoint.send(destination, body, headers)
  }

  subscribeToEndpoint(name, destination, callback) {
    const endpoint = this.getEndpoint(name)
    if (!endpoint) {
      console.error(`端点 ${name} 不存在`)
      return null
    }

    return endpoint.subscribe(destination, callback)
  }
}

export default new WebSocketManager()
