<template>
  <div class="login-page" @mousemove="handleMouseMove">
    <div class="login-container">
      <!-- 浮动背景元素 -->
      <div class="floating-elements">
        <span
          v-for="(element, index) in floatingElements"
          :key="index"
          :style="{
            left: element.left + 'px',
            top: element.top + 'px',
            width: element.size + 'px',
            height: element.size + 'px',
            animationDuration: 10 + Math.random() * 20 + 's',
            animationDelay: Math.random() * 5 + 's',
          }"
        ></span>
      </div>

      <!-- 登录表单 -->
      <div class="form-wrapper">
        <h2 class="login-title">欢迎登录</h2>

        <el-form
          :model="loginForm"
          :rules="loginRules"
          ref="loginFormRef"
          @submit.prevent="handleLogin"
          class="login-form"
        >
          <el-form-item prop="username">
            <div class="input-group">
              <el-input v-model="loginForm.username" placeholder="请输入用户名" size="large" />
              <span class="input-icon">🧙‍♂️</span>
            </div>
          </el-form-item>

          <el-form-item prop="password">
            <div class="input-group">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                show-password
                size="large"
              />
              <span class="input-icon">🔒</span>
            </div>
          </el-form-item>

          <div class="form-options">
            <el-checkbox v-model="rememberMe">记住密码</el-checkbox>
            <a href="#" class="forgot-link">忘记密码？</a>
          </div>

          <el-button
            type="primary"
            size="large"
            class="login-btn"
            :loading="loading"
            native-type="submit"
          >
            {{ loading ? '登录中...' : '登 录' }}
          </el-button>

          <div class="register-link">
            还没有账号？<a href="#" @click.prevent="switchToRegister">立即注册</a>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { login } from '../api/User'

// 路由实例
const router = useRouter()

// 响应式数据
const loginFormRef = ref()
const loading = ref(false)
const rememberMe = ref(false)

const loginForm = reactive({
  username: '',
  password: '',
})

// 浮动背景元素
const floatingElements = ref([])

// 验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 16, message: '用户名长度在 3 到 16 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
  ],
}

const handleMouseMove = (e) => {
  const x = e.clientX / window.innerWidth
  const y = e.clientY / window.innerHeight
  const moveX = (x - 0.5) * 10
  const moveY = (y - 0.5) * 10

  const loginContainer = document.querySelector('.login-container')
  if (loginContainer) {
    loginContainer.style.transform = `translate(${moveX}px, ${moveY}px)`
  }
}

const generateFloatingElements = () => {
  const elements = []
  for (let i = 0; i < 8; i++) {
    elements.push({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 60 + 20,
    })
  }
  floatingElements.value = elements
}

const handleLogin = async () => {
  if (!loginFormRef.value) return

  const valid = await loginFormRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true

  try {
    const { code, data } = await login(loginForm)
    if (code === 200) {
      // 登录成功处理
      ElMessage.success('登录成功！')
      // 存储登录状态
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userToken', data)
      // 跳转到首页
      router.push('/')
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('登录失败，请检查用户名和密码')
  } finally {
    loading.value = false
  }
}

const switchToRegister = () => {
  router.push('/register')
}

// 生命周期
onMounted(() => {
  generateFloatingElements()
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #87ceeb 0%, #b0e2ff 100%); /* 天蓝色渐变 */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow: hidden;
  position: relative;
}

.login-container {
  position: relative;
  width: 420px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow:
    0 15px 35px rgba(0, 0, 0, 0.1),
    0 3px 10px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  z-index: 2;
}

.login-container:hover {
  transform: translateY(-5px);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.15),
    0 5px 15px rgba(0, 0, 0, 0.1);
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.floating-elements span {
  position: absolute;
  display: block;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 15s linear infinite;
  opacity: 0.7;
}

@keyframes float {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.7;
  }
  90% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 28px;
  font-weight: 600;
}

.input-group {
  position: relative;
  margin-bottom: 20px;
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}

:deep(.el-input__wrapper) {
  padding-left: 45px !important;
  background: rgba(255, 255, 255, 0.9) !important;
  border-radius: 12px !important;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.3s ease !important;
}

:deep(.el-input__wrapper:hover),
:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3) !important;
  border-color: #667eea !important;
}

:deep(.el-input__inner::placeholder) {
  color: #999;
  font-size: 14px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.forgot-link {
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  height: 45px;
  background: linear-gradient(135deg, #63c4eb, #4db8f7);
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.register-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 14px;
}

.register-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.register-link a:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-container {
    width: 90%;
    padding: 30px 20px;
  }

  .login-title {
    font-size: 24px;
  }
}
</style>
