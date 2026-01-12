import './assets/main.css'
import { setupErrorHandler } from '@/utils/errorHandler'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'
const app = createApp(App)
// 配置全局错误处理器
const errorHandler = setupErrorHandler(router)
app.config.errorHandler = errorHandler
app.use(createPinia())
app.use(router)

app.mount('#app')
