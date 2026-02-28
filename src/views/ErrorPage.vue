<!-- src/views/ErrorPage.vue -->
<template>
  <div class="error-container">
    <!-- 错误代码显示 -->
    <div class="error-code" :style="{ color: errorColor }">{{ errorCode }}</div>

    <!-- 动态SVG图标 -->
    <div class="error-icon">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="50" fill="#fef2f2" />
        <path
          :fill="errorColor"
          d="M60,20 A40,40 0 1,1 60,100 A40,40 0 1,1 60,20 M60,30 A30,30 0 1,0 60,90 A30,30 0 1,0 60,30"
        />
        <rect x="55" y="40" width="10" height="20" :fill="errorColor" />
        <rect x="55" y="70" width="10" height="10" :fill="errorColor" />
      </svg>
    </div>

    <!-- 错误信息 -->
    <h1 class="error-title">{{ errorTitle }}</h1>
    <p class="error-message">{{ errorMessage }}</p>

    <!-- 解决方案建议 -->
    <div class="suggestions" v-if="suggestions.length">
      <h3>建议操作：</h3>
      <ul>
        <li v-for="(suggestion, index) in suggestions" :key="index">{{ suggestion }}</li>
      </ul>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <button @click="goHome" class="btn btn-primary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"
            stroke="currentColor"
            stroke-width="2"
          />
          <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" stroke-width="2" />
        </svg>
        返回首页
      </button>
      <!-- <button @click="reloadPage" class="btn btn-secondary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M23 4L23 10 17 10" stroke="currentColor" stroke-width="2" />
          <path d="M1 20L1 14 7 14" stroke="currentColor" stroke-width="2" />
          <path
            d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"
            stroke="currentColor"
            stroke-width="2"
          />
        </svg>
        刷新页面
      </button> -->
      <button @click="goBack" class="btn btn-outline" v-if="canGoBack">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" />
        </svg>
        返回上一步
      </button>
    </div>

    <!-- 技术信息（开发环境显示） -->
    <!-- <div v-if="isDevelopment && errorDetails" class="tech-info">
      <details>
        <summary>技术信息</summary>
        <pre>{{ errorDetails }}</pre>
      </details>
    </div> -->

    <!-- 联系支持 -->
    <!-- <div class="support">
      <p>如果问题持续存在，请联系技术支持：</p>
      <p class="contact">xxxxx</p>
    </div> -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const canGoBack = ref(false)

// 错误代码映射
const errorConfigs = {
  404: {
    title: '页面未找到',
    message: '抱歉，您访问的页面不存在或已被移除。',
    color: '#4299e1',
    suggestions: ['检查 URL 是否正确', '通过导航菜单访问页面', '使用搜索功能查找内容'],
  },
  500: {
    title: '服务器内部错误',
    message: '服务器遇到了意外错误，请稍后重试。',
    color: '#f56565',
    suggestions: ['稍后刷新页面重试', '清除浏览器缓存', '检查网络连接'],
  },
  502: {
    title: '网关错误',
    message: '服务器作为网关或代理时，从上游服务器收到无效响应。',
    color: '#ed8936',
    suggestions: ['等待几分钟后重试', '检查服务器状态', '联系管理员'],
  },
  503: {
    title: '服务不可用',
    message: '服务器暂时无法处理请求，通常是由于维护或过载。',
    color: '#ecc94b',
    suggestions: ['等待服务器恢复', '稍后重新访问', '查看服务状态公告'],
  },
  504: {
    title: '网关超时',
    message: '服务器作为网关或代理时，未能及时从上游服务器收到响应。',
    color: '#38b2ac',
    suggestions: ['检查网络连接', '稍后重试操作', '简化操作步骤'],
  },
}

// 获取错误代码
const errorCode = computed(() => {
  return route.params.code || '500'
})

// 获取错误配置
const currentConfig = computed(() => {
  return errorConfigs[errorCode.value] || errorConfigs['500']
})

// 计算属性
const errorColor = computed(() => currentConfig.value.color)
const errorTitle = computed(() => currentConfig.value.title)
const errorMessage = computed(() => currentConfig.value.message)
const suggestions = computed(() => currentConfig.value.suggestions || [])
const isDevelopment = computed(() => import.meta.env.DEV)
const errorDetails = computed(() => {
  if (route.query.error) {
    try {
      return JSON.parse(decodeURIComponent(route.query.error))
    } catch {
      return route.query.error
    }
  }
  return null
})

// 方法
const goHome = () => {
  router.push('/')
}

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  }
}

// 生命周期
onMounted(() => {
  canGoBack.value = window.history.length > 1
  console.log(errorCode.value)
  // 在控制台输出错误信息
  console.error(`页面错误 ${errorCode.value}: ${errorTitle.value}`)

  // 可以发送错误日志到服务器
  if (!isDevelopment.value) {
    sendErrorLog()
  }
})

// 发送错误日志
const sendErrorLog = () => {
  const logData = {
    code: errorCode.value,
    path: route.fullPath,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    referrer: document.referrer,
  }
  console.log(logData)
  // 使用 fetch 或 axios 发送错误日志
  // fetch('/api/log/error', { method: 'POST', body: JSON.stringify(logData) });
}
</script>

<style scoped>
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 0 2rem 0.5rem;
  background: linear-gradient(135deg, #87ceeb 0%, #b0e2ff 100%); /* 天蓝色渐变 */
  color: #333;
  text-align: center;
}

.error-code {
  font-size: 8rem;
  font-weight: 900;
  margin-bottom: 1rem;
  opacity: 0.3;
  position: absolute;
  top: 7rem;
  z-index: 0;
}

.error-icon {
  margin: 0 0 5rem 0;
  z-index: 1;
}

.error-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  /* color: white; */
  z-index: 1;
  margin-top: 3rem;
}

.error-message {
  font-size: 1.125rem;
  line-height: 1.6;
  /* color: rgba(255, 255, 255, 0.9); */
  max-width: 36rem;
  margin: 0 auto 2rem;
  z-index: 1;
}

.suggestions {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 1.5rem;
  /* margin: 1.5rem 0; */
  text-align: left;
  max-width: 36rem;
  width: 100%;
  z-index: 1;
}

.suggestions h3 {
  /* color: white; */
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
}

.suggestions ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.suggestions li {
  /* color: rgba(255, 255, 255, 0.8); */
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
}

.suggestions li:before {
  content: '•';
  color: v-bind(errorColor);
  position: absolute;
  left: 0;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin: 0.5rem 0;
  flex-wrap: wrap;
  justify-content: center;
  z-index: 1;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.btn-primary {
  background: white;
  color: #667eea;
}

.btn-primary:hover {
  background: #f7fafc;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.btn-outline {
  background: transparent;
  /* color: white; */
  border-color: white;
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.tech-info {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1.5rem 0;
  max-width: 36rem;
  width: 100%;
  z-index: 1;
}

.tech-info summary {
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  font-weight: 600;
}

.tech-info pre {
  background: rgba(0, 0, 0, 0.5);
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 0.375rem;
  margin-top: 0.5rem;
  overflow: auto;
  font-size: 0.875rem;
  text-align: left;
}

.support {
  margin-top: 2rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  z-index: 1;
}

.contact {
  color: white;
  font-weight: 600;
  margin-top: 0.25rem;
}

@media (max-width: 640px) {
  .error-code {
    font-size: 5rem;
  }

  .error-title {
    font-size: 1.75rem;
  }

  .action-buttons {
    flex-direction: column;
    width: 100%;
    max-width: 20rem;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
